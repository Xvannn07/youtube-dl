const pasteContainer = document.getElementById("paste");
const linkContainer = document.getElementById("video-url");

function pasteLink(isReturn) {
    '<span><i class="icon icon-clear"></i>Clear</span>' === pasteContainer.innerHTML ? (linkContainer.value = "", pasteContainer.innerHTML = '<span><i class="icon icon-paste"></i>Paste</span>') :

        navigator.clipboard.readText().then(async function (f) {
                var regYT = /https:\/\/youtu(?:be\.com|\.be\/)/;
                console.log("Link content :" + f);
                var isYT = regYT.test(f);
                console.log("Format: " + isYT);

                if (!isYT) {
                    console.log("Link format error");
                    isYT = false;
                    //格式错误
                    await costumAlert("Error, The Youtube link is temporarily invalid.", { status: "fail" })
                    if (isReturn) {
                        return linkContainer.value = "";
                    } else {
                        linkContainer.value = "";
                    }

                } else {
                    console.log("The link format is correct");
                    isYT = true;
                    linkContainer.value = f;
                    document.getElementById('alert').style.display = "none";
                    pasteContainer.innerHTML = '<span><i class="icon icon-clear"></i>Clear</span>';
                    //获取视频信息

                }

            });
}
pasteContainer.addEventListener("click", handlePasteLink);