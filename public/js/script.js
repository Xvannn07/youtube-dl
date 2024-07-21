document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('download-form');
    const submitBtn = document.getElementById('download-button');
    const resultElement = document.getElementById('download-result');
    const videoUrlInput = document.getElementById('video-url');
    const loadingContainer = document.getElementById('loading-container')
    const loadingElement = document.createElement('div');

    //const func = require("../src/function.js");
    
    navigator.clipboard && document.getElementById("paste").classList.remove("disabled");
    document.getElementById("paste").addEventListener("click",
        function () {

            pasteLink(true);
        });
  
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
          await axios({
            method: "POST",
            url: "/api",
            data: { url: videoUrl }
          })
          .then(resp => resp.data)
          .then(async (data) => {
            await axios({
                method: "GET",
                url: "/file/result.html"
            })
            .then(resp => resp.data)
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
    
                    document.getElementById('thumb').src = data.videoDetail.thumbnails[2].url || data.videoDetail.thumbnails[1].url || data.videoDetail.thumbnails[0].url;
                    document.getElementById('title').textContent = "Title: " + data.videoDetail.title;
                    document.getElementById('duration').textContent = "Duration: " + await convertToTime(data.videoDetail.lengthSeconds) || "Not Found";
                    document.getElementById('author').textContent = "Author: " + data.videoDetail.author.name || "Not Found";
                    document.getElementById('channel').textContent = "Channel: " + data.videoDetail.author.user || "Not Found";
                    document.getElementById('upload').textContent = "Upload Date: " + await convertDateFormat(data.videoDetail.uploadDate) || "Not Found";
                    document.getElementById('views').textContent = "Views: " + await convertViews(data.videoDetail.viewCount) || "Not Found";
     
                    // video result
                    const video_tabel = document.getElementById('video-table');
                    const tbodyA = document.createElement('tbody');
                    video_tabel.appendChild(tbodyA);
                    data.format_video.forEach(element => {
                      if(element.mimeType.split(";")[0] == "video/mp4" || element.mimeType.split(";")[0] == "video/webm") {
                        let tr = document.createElement('tr');
                        tr.innerHTML = `
                              <td>${element.qualityLabel}</td>
                              <td>${byteToMegabyte(element.contentLength) || "Not Found"}</td>
                              <td>${element.mimeType.split(";")[0]}</td>
                              <td>${element.hasAudio ? "<i class='fas fa-volume-up'></i>": "<i class='fas fa-volume-mute'></i>"}</td>
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
                      if(element.mimeType.split(";")[0] == "audio/mp4" || element.mimeType.split(";")[0] == "audio/webm") {
                        let tr = document.createElement('tr');
                        tr.innerHTML = `
                              <td>${element.audioQuality}</td>
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
