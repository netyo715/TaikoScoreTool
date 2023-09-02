import React from 'react';
import { Button } from '@mui/material';

const CopyScriptButton: React.FunctionComponent = () => {
  // ブックマークレットコピー
  const copyScript = () => {
    navigator.clipboard.writeText('javascript:void(async function(){async function getScore(){var e=[];let t=["played","silver","gold","donderfull"];for(var n=1;n<=8;n++){let r="https://donderhiroba.jp/score_list.php?genre="+n.toString();var a=[];await fetch(r).then(e=>e.text()).then(e=>{let n=new DOMParser,r=n.parseFromString(e,"text/html"),s=r.getElementById("songList"),o=s.getElementsByClassName("contentBox");for(var l=0;l<o.length;l++){var i=o[l],c={name:"",isUra:!1,crown:0,rank:0};if(c.name=i.getElementsByClassName("songName")[0].textContent,i.getElementsByClassName("songNameArea")[0].classList.contains("ura")){c.isUra=!0;var g=i.getElementsByClassName("crown")[0]}else var g=i.getElementsByClassName("crown")[3];let m=g.getAttribute("src").replace("image/sp/640/crown_button_","").replace("_640.png","");for(var d=0;d<t.length;d++)m.includes(t[d])&&(c.crown=d);for(var d=0;d<=8;d++)m.includes(d.toString())&&(c.rank=d);a.push(c)}}).catch(e=>{console.log(e)}),e.push(a)}return e}if(document.getElementById("scoreToolButton"))alert("既にブックマークレットを実行しています。");else{var e=document.createElement("button");e.textContent="loading...",e.setAttribute("id","scoreToolButton"),document.body.insertBefore(e,document.body.firstChild),results=await getScore(),e.addEventListener("click",function(){navigator.clipboard.writeText(JSON.stringify(results,null,"")).then(()=>{alert("copy success")},()=>{alert("copy failed")})}),e.textContent="クリップボードにコピー"}}());').then(
    () => {alert("copy success");},
    () => {alert("copy failed");}
    );
  }
  return (
    <Button variant="contained" onClick={copyScript}>ブックマークレットをコピー</Button>
  );
};

export default CopyScriptButton;
