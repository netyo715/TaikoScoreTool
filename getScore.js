javascript:void(async function(){
async function getScore(){
    var results = [];
    for (var genre=1; genre<=8; genre++){
        const url = "https://donderhiroba.jp/score_list.php?genre=" + genre.toString();
        await fetch(url).then(response => response.text()).then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            var songList = doc.getElementById("songList");
            var songs = songList.getElementsByClassName("contentBox");
            var crownColors = ["played", "silver", "gold", "donderfull"];
            for (var i=0; i < songs.length; i++){
                var song = songs[i];
                var result = {
                    "songName": "",
                    "isUra": false,
                    "crown": 0,
                    "rank": 0,
                };
                result.songName = song.getElementsByClassName("songName")[0].textContent;
                if (song.getElementsByClassName("songNameArea")[0].classList.contains("ura")){
                    result.isUra = true;
                    var buttonImages = song.getElementsByClassName("crown")[0];
                }else{
                    var buttonImages = song.getElementsByClassName("crown")[3];
                }
                var srcName = buttonImages.getAttribute("src").replace("image/sp/640/crown_button_", "").replace("_640.png", "");
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
                results.push(result);
            }
        }).catch(error => {
            console.log(error);
        });
    }
    return results;
}

results = await getScore();
var copyButton = document.createElement("button");
copyButton.textContent = "クリップボードにコピー";
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
var headerImg = document.getElementsByTagName("img")[0];
document.body.insertBefore(copyButton, headerImg);
}());