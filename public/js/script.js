document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const submitBtn = document.getElementById('download-button');
    const resultElement = document.getElementById('download-result');
    const videoUrlInput = document.getElementById('video-url');
    const loadingContainer = document.getElementById('loading-container')
    const loadingElement = document.createElement('div');

    //const func = require("../src/function.js");
    
    videoUrlInput.addEventListener('input', togglePasteButton);
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const videoUrl = videoUrlInput.value.trim();
      loadingElement.classList.add('loading-spinner');
      loadingContainer.appendChild(loadingElement);
      loadingElement.style.display = 'block';

      const url_regex = /https:\/\/youtu(?:be\.com|\.be\/)/

      if(!url_regex.test(videoUrl)) {
        await costumAlert("The Link You Entreted Does Not Match!!!", { status: "fail"});
        loadingElement.style.display = 'none';
      }

      if (url_regex.test(videoUrl) && videoUrl) {
        alertContainer.style.display = 'none';
        try {
          await costumAlert("progres...", { status: "procces"});
          await fetch("/api", {
            method: "POST",
            body: JSON.stringify({ url: videoUrl }),
            headers: {
                "Content-type": "application/json"
            }
          })
          .then(resp => resp.json())
          .then(async (data) => {
            await fetch("/file/result.html", {
                method: "GET"
            })
            .then(resp => resp.text())
            .then(async (htmls) => {
                
                loadingElement.style.display = 'none';
                alertContainer.style.display = 'none';
                

                if(data.status == "error") {
                    await costumAlert(data.message, { status: "fail"});
                }
                if(data.status == "oke") {             
                    resultElement.innerHTML = htmls;
                    resultElement.focus();
                    await costumAlert("succes", { status: "succes"});
    
                    const videoBtn = document.getElementById('video-btn');
                    const audioBtn = document.getElementById('audio-btn');
                    const videoTable = document.getElementById('video-table');
                    const audioTable = document.getElementById('audio-table');
                    videoTable.classList.remove('hidden');
    
                    videoBtn.addEventListener('click', () => {
                        videoTable.classList.remove('hidden');
                        audioTable.classList.add('hidden');
                    });
                  
                    audioBtn.addEventListener('click', () => {
                        audioTable.classList.remove('hidden');
                        videoTable.classList.add('hidden');
                    });
    
                    document.getElementById('thumb').src = data.videoDetail.thumbnail
                    document.getElementById('title').textContent = "Title: " + data.videoDetail.title;
                    document.getElementById('duration').textContent = "Duration: " + await convertToTime(data.videoDetail.duration) || "Not Found";
                    //document.getElementById('author').textContent = "Author: " + data.videoDetail.author.name || "Not Found";
                    //document.getElementById('channel').textContent = "Channel: " + data.videoDetail.author.user || "Not Found";
                    //document.getElementById('upload').textContent = "Upload Date: " + await convertDateFormat(data.videoDetail.uploadDate) || "Not Found";
                    //document.getElementById('views').textContent = "Views: " + await convertViews(data.videoDetail.viewCount) || "Not Found";
     
                    // video result
                    const video_tabel = document.getElementById('video-table');
                    const tbodyA = document.createElement('tbody');
                    video_tabel.appendChild(tbodyA);
                    data.format_video.forEach(async(element) => {
                      if((element.ext === "mp4" || element.ext === "webm") && !element.audio ) {
                        let tr = document.createElement('tr');
                        tr.innerHTML = `
                              <td>${element.quality}</td>
                              <td>${byteToMegabyte(element.contentLength || await (await (await fetch(element.url, { method: "GET", headers: { "User-Agent": "okhttp/4.4.0", "Referer": element.url, "Origin": "https://google.com" }}))).arrayBuffer())?.byteLength || "Not Found"}</td>
                              <td>${element.ext}</td>
                              <td><span class="icon-center">${element.no_audio ? '<i class="fa-solid fa-volume-high"></i>': '<i class="fa-solid fa-volume-xmark"></i>'}</span></td>
                              <td><a target="_blank" href=${element.url}><button type="button" class="btn btn-success"><lord-icon src="https://cdn.lordicon.com/xcrjfuzb.json" trigger="loop" delay="1000" style="width:15px;height:15px;margin-right:10px;display:inline-block"> </lord-icon>Download</button></a></td>
                        `;
                        tbodyA.appendChild(tr);
                      };
                    });
    
                    // audio result
                    const audio_tabel = document.getElementById('audio-table');
                    const tbodyB = document.createElement('tbody');
                    audio_tabel.appendChild(tbodyB);
                    data.format_video.forEach(element => {
                      if((element.ext === "opus" || element.ext == "m4a") && element.audio) {
                        let tr = document.createElement('tr');
                        tr.innerHTML = `
                              <td>${element.quality}</td>
                              <td>${byteToMegabyte(element.contentLength)}</td>
                              <td>${element.mimeType.split(";")[0]}</td>
                              <td><a target="_blank" href=${element.url}><button type="button" class="btn btn-success"><lord-icon src="https://cdn.lordicon.com/xcrjfuzb.json" trigger="loop" delay="1000" style="width:15px;height:15px;margin-right:10px;display:inline-block"> </lord-icon>Download</button></a></td>
                        `;
                        tbodyB.appendChild(tr);
                      };
                    });
                };
            });
          });
        } catch (error) {
          await costumAlert("An error occurred on the server, please wait a moment, we will fix it immediately", { status: "fail"});
          console.error(`Error fetching result: ${error}`);
        }
      }
    });
  });
