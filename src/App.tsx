import React, { useEffect, useState } from 'react';
import './App.css';
import ScoreTable from './ScoreTable';
import SongInfoJson from "./songInfo.json";
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';
import CopyScriptButton from './CopyScriptButton';

import crown0 from "./image/crown_0.png";
import crown1 from  "./image/crown_1.png";
import crown2 from  "./image/crown_2.png";
import crown3 from  "./image/crown_3.png";
import rank2 from "./image/rank_2.png";
import rank3 from "./image/rank_3.png";
import rank4 from "./image/rank_4.png";
import rank5 from "./image/rank_5.png";
import rank6 from "./image/rank_6.png";
import rank7 from "./image/rank_7.png";
import rank8 from "./image/rank_8.png";

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

const CROWN = ["未クリア", "クリア", "フルコンボ", "ドンダフルコンボ"];
const RANK = ["ランクなし", "粋1", "粋2", "粋3", "雅1", "雅2", "雅3", "極"];

const CROWN_IMAGE = [crown0, crown1, crown2, crown3];
const RANK_IMAGE = [rank2, rank3, rank4, rank5, rank6, rank7, rank8];

function App() {
  const [scoreArray, setScoreArray] = useState<SongScore[]>([]);
  const [sortedScoreArray, setSortedScoreArray] = useState<SongScore[]>([]);
  const [songInfoArray, setSongInfoArray] = useState<SongInfo[]>([]);

  const [filterDifficulty, setFilterDifficulty] = useState<boolean[]>(new Array(10).fill(true));
  const [filterCrown, setFilterCrown] = useState<boolean[]>(new Array(4).fill(true));
  const [filterRank, setFilterRank] = useState<boolean[]>(new Array(8).fill(true));
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

  useEffect(() => {
    setSortedScoreArray(scoreArray
      .filter(song => filterDifficulty[song.difficulty-1] && filterCrown[song.crown] && filterRank[song.rank==0 ? song.rank : song.rank-1])
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
      }));
  }, [scoreArray, filterDifficulty, filterCrown, filterRank, sortBy, sortDescending]);

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
        if(i!=5 && value.name=="エンジェル ドリーム"){
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

  const alertRandomSong = () => {
    const song = sortedScoreArray[Math.floor(Math.random() * sortedScoreArray.length)];
    alert(`${song.name}\nクリア: ${CROWN[song.crown]}\nランク: ${song.rank==0 ? "ランクなし" : RANK[song.rank-1]}`);
  };

  return (
    <div className="App">
      <p>「このコンテンツはファンメイドコンテンツです。ファンメイドコンテンツポリシー（<a href="https://taiko-ch.net/ip_policy/">https://taiko-ch.net/ip_policy/</a>）のもと制作されています。」</p>
      <p><a href="https://github.com/netyo715/TaikoScoreTool/blob/master/README.md" target="_blank">使い方</a></p>
      <div>
        <CopyScriptButton />
        <Button variant="contained" onClick={inputScore}>スコア貼り付け</Button>
      </div>
      <div>
        <ToggleButtonGroup color="primary">
          {filterDifficulty.slice(0, 5).map((selected, index) => (
            <ToggleButton selected={selected} value={index} onClick={() => toggleFilterDifficulty(index)}>
              {"☆" + (index+1)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div>
        <ToggleButtonGroup color="primary">
          {filterDifficulty.slice(5, 10).map((selected, index) => (
            <ToggleButton selected={selected} value={index+5} onClick={() => toggleFilterDifficulty(index+5)}>
              {"☆" + (index+6)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div>
        <ToggleButtonGroup color="primary">
          {filterCrown.map((selected, index) => (
            <ToggleButton selected={selected} value={index} onClick={() => toggleFilterCrown(index)}>
              {<img src={CROWN_IMAGE[index]} style={{height:30}}/>}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div>
        <ToggleButtonGroup color="primary">
          {filterRank.slice(0, 4).map((selected, index) => (
            <ToggleButton selected={selected} value={index} onClick={() => toggleFilterRank(index)}>
              {index >= 1 ? <img src={RANK_IMAGE[index-1]} style={{height:30}}/> : "ランクなし"}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div>
        <ToggleButtonGroup color="primary">
          {filterRank.slice(4, 8).map((selected, index) => (
            <ToggleButton selected={selected} value={index+4} onClick={() => toggleFilterRank(index+4)}>
              <img src={RANK_IMAGE[index+3]} style={{height:30}}/>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
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
      <div>
        <Button variant="contained" onClick={alertRandomSong}>ランダム選曲</Button>
      </div>
      <ScoreTable scoreArray={sortedScoreArray} />
    </div>
  );
}

export default App;
