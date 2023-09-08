import { useEffect, useState } from 'react';
import './App.css';
import SongInfoJson from "./songInfo.json";
import { Button } from '@mui/material';
import CopyScriptButton from './CopyScriptButton';

import AllSongTab from './AllSongTab';

type JsonSongScore = {
  name: string;
  isUra: boolean;
  crown: number;
  rank: number;
}

type SongScore = {
  id: number;
  name: string;
  mainGenre: number;
  genre: number[];
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

function App() {
  const [scoreArray, setScoreArray] = useState<SongScore[]>([]);
  const [songInfoArray, setSongInfoArray] = useState<SongInfo[]>([]);

  // 初期化時処理
  useEffect(() => {
    // ジャンル/難易度データ読み込み
    var _songInfoArray: SongInfo[] = [];
    SongInfoJson.forEach((value) => {
      var genre = [value.genre1];
      if (value.genre2 !== 0){genre.push(value.genre2);}
      if (value.genre3 !== 0){genre.push(value.genre3);}
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
    const storageSongList = localStorage.getItem("songList");
    if (storageSongList){
      const parsedJson = JSON.parse(storageSongList)
      setScoreArray(parsedJson);
      console.log("get localstorage score.");
    }else{
      console.log("localstorage score not found.");
    }
  }, []);

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
        id: value.id,
        name: value.name + (value.isUra ? " (裏)" : ""),
        difficulty: value.difficulty,
        mainGenre: value.mainGenre,
        genre: value.genre,
        crown: crown,
        rank: rank,
      });
    });
    setScoreArray(_scoreArray);
    localStorage.setItem("songList", JSON.stringify(_scoreArray));
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
      <AllSongTab scoreArray={scoreArray}/>
    </div>
  );
}

export default App;
