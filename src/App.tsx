import { useEffect, useState } from 'react';
import './App.css';
import SongInfoJson from "./songInfo.json";
import ExSongInfoJson from "./exSongInfo.json";
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CopyScriptButton from './CopyScriptButton';

import AllSongTab from './AllSongTab';

function App() {
  const [scoreArray, setScoreArray] = useState<SongScore[]>([]);
  const [allScoreMap, setAllScoreMap] = useState<{[key:number]: SongScore}>({});
  const [songInfoArray, setSongInfoArray] = useState<SongInfo[]>([]);
  const [exSongInfoArray, setExSongInfoArray] = useState<SongInfo[]>([]);
  const [displayTabIndex, setDisplayTabIndex] = useState<number>(0);

  // 初期化時処理
  useEffect(() => {
    // ジャンル/難易度データ読み込み
    var _songInfoArray: SongInfo[] = [];
    SongInfoJson.forEach((value) => {
      var genre = [value.genre1];
      if (value.genre2 !== 0){genre.push(value.genre2);}
      if (value.genre3 !== 0){genre.push(value.genre3);}
      _songInfoArray.push({
        viewId: value.viewId,
        id: value.id,
        name: value.name,
        isUra: value.isUra,
        mainGenre: value.mainGenre,
        genre: genre,
        difficulty: value.difficulty,
      });
    });
    setSongInfoArray(_songInfoArray);
    var _exSongInfoArray: SongInfo[] = [];
    ExSongInfoJson.forEach((value) => {
      var genre = [value.genre1];
      if (value.genre2 !== 0){genre.push(value.genre2);}
      if (value.genre3 !== 0){genre.push(value.genre3);}
      _exSongInfoArray.push({
        viewId: value.viewId,
        id: value.id,
        name: value.name,
        isUra: value.isUra,
        mainGenre: value.mainGenre,
        genre: genre,
        difficulty: value.difficulty,
      });
    });
    setExSongInfoArray(_exSongInfoArray);
    loadLocalStorageScore();
  }, []);

  const loadLocalStorageScore  = () => {
    // ブラウザに保存済みのデータ読み込み
    const storageSongList = localStorage.getItem("songList");
    if (!storageSongList){
      console.log("localstorage score not found.");
      return;
    }
    const parsedSongList = JSON.parse(storageSongList);
    setScoreArray(parsedSongList);
    console.log("get localstorage score.");

    const storageAllScoreMap = localStorage.getItem("allScoreMap");
    if (!storageAllScoreMap){
      console.log("localstorage score map not found.");
      return;
    }
    const parsedAllScoreMap = JSON.parse(storageAllScoreMap);
    setAllScoreMap(parsedAllScoreMap);
    console.log("get localstorage score map.");
  }

  // 入力からデータ読み込み
  const inputScore = () => {
    const jsonData = prompt("データを入力");
    if (!jsonData) {return;}
    const inputScoreArray: JsonSongScore[][] = JSON.parse(jsonData);
    var inputScoreMap: {[key:string]: JsonSongScore}[] = [{}, {}];
    for (let i = 0; i < 8; i++) {
      inputScoreArray[i].forEach((value) => {
        const idx = value.isUra ? 1: 0;
        // ナムコ以外のエンジェルドリームはアイマス版として扱う
        if(i!==5 && value.name==="エンジェル ドリーム"){
          value.name += "(アイマス)";
        }
        inputScoreMap[idx][value.name] = value;
      });
    }
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
        type: "SongScore",
        viewId: value.viewId,
        id: value.id,
        name: value.name + (value.isUra ? " (裏)" : ""),
        difficulty: value.difficulty,
        mainGenre: value.mainGenre,
        genre: value.genre,
        crown: crown,
        rank: rank,
      });
    });
    var _scoreMap: {[key:number]: SongScore} = {};
    _scoreArray.forEach((song: SongScore) => {
      _scoreMap[song.id] = song;
    });
    exSongInfoArray.forEach((value) => {
      _scoreMap[value.id] = {
        type: "SongScore",
        viewId: value.viewId,
        id: value.id,
        name: value.name + (value.isUra ? " (裏)" : ""),
        difficulty: value.difficulty,
        mainGenre: value.mainGenre,
        genre: value.genre,
        crown: 0,
        rank: 0,
      }
    });
    setScoreArray(_scoreArray);
    setAllScoreMap(_scoreMap);
    localStorage.setItem("songList", JSON.stringify(_scoreArray));
    localStorage.setItem("allScoreMap", JSON.stringify(_scoreMap));
    console.log("set localstorage score");
  }

  return (
    <div id="App">
      <h1>太鼓の達人 スコア管理ツール(開発中)</h1>
      <p>このコンテンツはファンメイドコンテンツです。<br/>ファンメイドコンテンツポリシー（<a href="https://taiko-ch.net/ip_policy/">https://taiko-ch.net/ip_policy/</a>）のもと制作されています。</p>
      <p><a href="https://github.com/netyo715/TaikoScoreTool/blob/master/README.md" target="_blank">使い方/機能要望等</a></p>
      <div>
        <CopyScriptButton />
        <Button variant="contained" onClick={inputScore}>スコア貼り付け</Button>
      </div>
      <ToggleButtonGroup color="primary">
        <ToggleButton selected={displayTabIndex===0} value={0} onClick={() => setDisplayTabIndex(0)}>全曲表示</ToggleButton>
        <ToggleButton selected={displayTabIndex===1} value={1} onClick={() => setDisplayTabIndex(1)}>☆10難易度表</ToggleButton>
      </ToggleButtonGroup>
      <div style={{display: displayTabIndex===0 ? "block" : "none"}}>
        <AllSongTab scoreArray={scoreArray}/>
      </div>
      <div style={{display: displayTabIndex===1 ? "block" : "none"}}>
        <p>☆10難易度表</p>
      </div>
    </div>
  );
}

export default App;
