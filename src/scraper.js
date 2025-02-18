const axios = require("axios");
const crypto = require("crypto");

async function ummy(urls) {
  const req = await axios.create({
    baseURL: "https://ummy.net",
    headers: {
      "authority": "ummy.net",
      "origin": "https://ummy.net",
      "referer": "https://ummy.net/en106xl/",
      "user-agent": "Postify/1.0.0"
    }
  });
  
  // msec
  const msec = (await req({
    method: "GET",
    url: "/msec"
  })).data.msec;
  
  //key
  const constant = {
    timestamp: 1739475766883,
    msec: Math.floor(msec * 1000),
    key: '3ebc107aad6d9cc098c104daba29522ed56ebfe68256ef111b9805c2e59a8063'
  };
  
  // data hash
  const time = Date.now() - (constant.msec ? Date.now() - constant.msec : 0);
  
  const signature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${urls}${time}${constant.key}`)).then(buffer => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(''));
  
  // exc
  const response = await req({
    method: "POST",
    url: "/api/convert",
    data: {
      url: urls,
      ts: time,
      _ts: constant.timestamp,
      _tsc: constant.msec,
      _s: signature
    }
  });
  
  return response.data;
}

module.exports = { ummy };
