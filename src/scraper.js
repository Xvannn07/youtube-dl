const axios = require("axios");
const crypto = require("crypto");

async function ummy(urls) {
  try {
    // Membuat instance axios dengan konfigurasi yang diinginkan
    const req = axios.create({
      baseURL: "https://ummy.net",
      headers: {
        "authority": "ummy.net",
        "origin": "https://ummy.net",
        "referer": "https://ummy.net/en106xl/",
        "user-agent": "Postify/1.0.0"
      }
    });

    // Mendapatkan msec
    const msecResponse = await req({
      method: "GET",
      url: "/msec"
    });
    const msec = msecResponse.data.msec;

    // Menentukan nilai konstan
    const constant = {
      timestamp: 1739475766883,
      msec: Math.floor(msec * 1000),
      key: "3ebc107aad6d9cc098c104daba29522ed56ebfe68256ef111b9805c2e59a8063"
    };

    // Menghitung waktu dan membuat string yang akan di-hash
    const time = Date.now() - (constant.msec ? Date.now() - constant.msec : 0);
    const dataToHash = `${urls}${time}${constant.key}`;

    // Menghasilkan signature SHA-256
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(dataToHash)
    );
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    // Melakukan request POST untuk konversi
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

    // Mengembalikan response jika berhasil
    return {
      status: true,
      data: response.data
    };

  } catch (e) {
    // Menangani error dan mengembalikan pesan error
    return {
      status: false,
      log: e.message
    };
  }
}

module.exports = { ummy };
