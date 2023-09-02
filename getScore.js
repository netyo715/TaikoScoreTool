javascript:void(async function(){
async function getScore(){
    var results = [];
    const crownColors = ["played", "silver", "gold", "donderfull"];
    for (var genre=1; genre<=8; genre++){
        const url = "https://donderhiroba.jp/score_list.php?genre=" + genre.toString();
        var temp = [];
        await fetch(url).then(response => response.text()).then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const songList = doc.getElementById("songList");
            const songs = songList.getElementsByClassName("contentBox");
            for (var i=0; i < songs.length; i++){
                var song = songs[i];
                var result = {
                    "name": "",
                    "isUra": false,
                    "crown": 0,
                    "rank": 0,
                };
                result.name = song.getElementsByClassName("songName")[0].textContent;
                if (song.getElementsByClassName("songNameArea")[0].classList.contains("ura")){
                    result.isUra = true;
                    var buttonImages = song.getElementsByClassName("crown")[0];
                }else{
                    var buttonImages = song.getElementsByClassName("crown")[3];
                }
                const srcName = buttonImages.getAttribute("src").replace("image/sp/640/crown_button_", "").replace("_640.png", "");
                for (var k=0; k<crownColors.length; k++){
                    if (srcName.includes(crownColors[k])){
                        result.crown = k;
                    }
                }
                for (var k=0; k<=8; k++){
                    if (srcName.includes(k.toString())){
                        result.rank = k;
                    }
                }
                temp.push(result);
            }
        }).catch(error => {
            console.log(error);
        });
        results.push(temp);
    }
    return results;
}

if (!document.getElementById("scoreToolButton")){
    var copyButton = document.createElement("button");
    copyButton.textContent = "loading...";
    copyButton.setAttribute("id", "scoreToolButton");
    document.body.insertBefore(copyButton, document.body.firstChild);
    results = await getScore();
    copyButton.addEventListener("click", function(){
        navigator.clipboard.writeText(JSON.stringify(results, null, '')).then(
            () => {
                alert("copy success");
            },
            () => {
                alert("copy failed");
            }
        );
    });
    copyButton.textContent = "クリップボードにコピー";
}else{
    alert("既にブックマークレットを実行しています。");
}
}());