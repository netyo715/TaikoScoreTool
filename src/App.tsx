import React, { useEffect, useState } from 'react';
import './App.css';
import ScoreTable from './ScoreTable';
import SongInfoJson from "./songInfo.json";
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';

type JsonSongScore = {
  name: string;
  isUra: boolean;
  crown: number;
  rank: number;
}

type SongScore = {
  id: number;
  name: string;
  difficulty: number;
  crown: number;
  rank: number;
}

type SongInfo = {
  id: number;
  name: string;
  isUra: boolean;
  mainGenre: number;
  genre: number[];
  difficulty: number;
}

const CROWN = ["未クリア", "クリア", "フルコンボ", "ドンダフルコンボ"];
const RANK = ["ランクなし", "粋1", "粋2", "粋3", "雅1", "雅2", "雅3", "極"];

function App() {
  const [scoreArray, setScoreArray] = useState<SongScore[]>([]);
  const [songInfoArray, setSongInfoArray] = useState<SongInfo[]>([]);

  const [filterDifficulty, setFilterDifficulty] = useState<boolean[]>(new Array(11).fill(true));
  const [filterCrown, setFilterCrown] = useState<boolean[]>(new Array(4).fill(true));
  const [filterRank, setFilterRank] = useState<boolean[]>(new Array(9).fill(true));
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'crown' | 'rank' | 'difficulty'>('id');
  const [sortDescending, setSortDescending] = useState<boolean>(false);

  // 初期化時処理
  useEffect(() => {
    // ジャンル/難易度データ読み込み
    var _songInfoArray: SongInfo[] = [];
    SongInfoJson.forEach((value) => {
      var genre = [value.genre1];
      if (value.genre2 != 0){genre.push(value.genre2);}
      if (value.genre3 != 0){genre.push(value.genre3);}
      _songInfoArray.push({
        id: value.id,
        name: value.songName,
        isUra: value.isUra,
        mainGenre: value.mainGenre,
        genre: genre,
        difficulty: value.difficulty,
      });
    });
    setSongInfoArray(_songInfoArray);

    // ブラウザに保存済みのデータ読み込み
    const storageData = localStorage.getItem("songList");
    if (storageData){
      const parsedJson = JSON.parse(storageData)
      setScoreArray(parsedJson);
      console.log("get localstorage score.");
    }else{
      console.log("localstorage score not found.");
    }
  }, []);

  // ブックマークレットコピー
  const copyScript = () => {
    navigator.clipboard.writeText('javascript:void(async function(){results=await async function(){for(var g=[],e=1;e<=8;e++){var t="https://donderhiroba.jp/score_list.php?genre="+e.toString();await fetch(t).then(e=>e.text()).then(e=>{const t=new DOMParser,n=t.parseFromString(e,"text/html");for(var a=n.getElementById("songList").getElementsByClassName("contentBox"),r=["played","silver","gold","donderfull"],s=0;s<a.length;s++){var o=a[s],l={name:"",isUra:!1,crown:0,rank:0};l.name=o.getElementsByClassName("songName")[0].textContent;for(var c=(o.getElementsByClassName("songNameArea")[0].classList.contains("ura")?(l.isUra=!0,o.getElementsByClassName("crown")[0]):o.getElementsByClassName("crown")[3]).getAttribute("src").replace("image/sp/640/crown_button_","").replace("_640.png",""),i=0;i<r.length;i++)c.includes(r[i])&&(l.crown=i);for(i=0;i<=8;i++)c.includes(i.toString())&&(l.rank=i);g.push(l)}}).catch(e=>{console.log(e)})}return g}();var e=document.createElement("button");e.textContent="クリップボードにコピー",e.addEventListener("click",function(){navigator.clipboard.writeText(JSON.stringify(results,null,"")).then(()=>{alert("copy success")},()=>{alert("copy failed")})});var t=document.getElementsByTagName("img")[0];document.body.insertBefore(e,t)}());').then(
    () => {alert("copy success");},
    () => {alert("copy failed");}
    );
  }

  // 入力からデータ読み込み
  const inputScore = () => {
    const jsonData = prompt("データを入力");
    if (!jsonData) {return;}
    const inputScoreArray: JsonSongScore[] = JSON.parse(jsonData);
    var inputScoreMap: {[key:string]: JsonSongScore}[] = [{}, {}];
    inputScoreArray.forEach((value) => {
      const idx = value.isUra ? 1: 0;
      inputScoreMap[idx][value.name] = value;
    });
    var _scoreArray: SongScore[] = [];
    songInfoArray.forEach((value) => {
      const idx = value.isUra ? 1: 0;
      var crown = 0;
      var rank = 0;
      if (value.name in inputScoreMap[idx]){
        crown = inputScoreMap[idx][value.name].crown;
        rank = inputScoreMap[idx][value.name].rank;
      }
      _scoreArray.push({
        id: value.id,
        name: value.name + (value.isUra ? " (裏)" : ""),
        difficulty: value.difficulty,
        crown: crown,
        rank: rank,
      });
    });
    setScoreArray(_scoreArray);
    localStorage.setItem("songList", JSON.stringify(_scoreArray));
    console.log("set localstorage score");
  }

  // 以下ソート/フィルター
  const toggleFilterDifficulty = (index: number) => {
    const updatedFilters = [...filterDifficulty];
    updatedFilters[index] = !updatedFilters[index];
    setFilterDifficulty(updatedFilters);
  };

  const toggleFilterCrown = (index: number) => {
    const updatedFilters = [...filterCrown];
    updatedFilters[index] = !updatedFilters[index];
    setFilterCrown(updatedFilters);
  };

  const toggleFilterRank = (index: number) => {
    const updatedFilters = [...filterRank];
    updatedFilters[index] = !updatedFilters[index];
    setFilterRank(updatedFilters);
  };

  const toggleSortDescending = () => {
    setSortDescending(prev => !prev);
  };
  // 以上ソート/フィルター

  const sortedScoreArray = scoreArray
    .filter(song => filterDifficulty[song.difficulty] && filterCrown[song.crown] && filterRank[song.rank])
    .sort((a, b) => {
      const sortMultiplier = sortDescending ? -1 : 1;
      if (sortBy === 'id') {
        return sortMultiplier * (a.id - b.id);
      } else if (sortBy === 'name') {
        return sortMultiplier * a.name.localeCompare(b.name);
      } else if (sortBy === 'crown') {
        return sortMultiplier * (a.crown - b.crown);
      } else if (sortBy === 'difficulty') {
        return sortMultiplier * (a.difficulty - b.difficulty);
      } else {
        return sortMultiplier * (a.rank - b.rank);
      }
    });

  return (
    <div className="App">
      <p>「このコンテンツはファンメイドコンテンツです。ファンメイドコンテンツポリシー（<a href="https://taiko-ch.net/ip_policy/">https://taiko-ch.net/ip_policy/</a>）のもと制作されています。」</p>
      <div>
        <Button onClick={copyScript}>ブックマークレットをコピー</Button>
        <p>適当なWebページをブックマークに登録し、URLをコピーしたブックマークレットに置き換えてください</p>
        <Button onClick={inputScore}>スコア貼り付け</Button>
      </div>
      <div>
        {filterDifficulty.map((checked, index) => (
          <label key={index}>
            <Checkbox checked={checked} onChange={() => toggleFilterDifficulty(index)} />
            {index}
          </label>
        ))}
      </div>
      <div>
        {filterCrown.map((checked, index) => (
          <label key={index}>
            <Checkbox checked={checked} onChange={() => toggleFilterCrown(index)} />
            {CROWN[index]}
          </label>
        ))}
      </div>
      <div>
        {filterRank.map((checked, index) => (
          <label key={index}>
            <Checkbox checked={checked} onChange={() => toggleFilterRank(index)} />
            {RANK[index]}
          </label>
        ))}
      </div>
      <RadioGroup row aria-label="sort" name="sort" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
        <FormControlLabel value="id" control={<Radio />} label="選曲画面" />
        <FormControlLabel value="name" control={<Radio />} label="曲名" />
        <FormControlLabel value="difficulty" control={<Radio />} label="難易度" />
        <FormControlLabel value="crown" control={<Radio />} label="王冠" />
        <FormControlLabel value="rank" control={<Radio />} label="ランク" />
      </RadioGroup>
      <FormControlLabel
        control={<Checkbox checked={sortDescending} onChange={toggleSortDescending} />}
        label="降順にする"
      />
      <ScoreTable scoreArray={sortedScoreArray}></ScoreTable>
    </div>
  );
}

export default App;
