import React, { useEffect, useState } from 'react';
import ScoreTable from './ScoreTable';
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup, ToggleButton, ToggleButtonGroup } from '@mui/material';

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

interface Props {
  scoreArray: SongScore[];
};

const CROWN = ["未クリア", "クリア", "フルコンボ", "ドンダフルコンボ"];
const RANK = ["ランクなし", "粋1", "粋2", "粋3", "雅1", "雅2", "雅3", "極"];

const CROWN_IMAGE = [crown0, crown1, crown2, crown3];
const RANK_IMAGE = [rank2, rank3, rank4, rank5, rank6, rank7, rank8];

const AllSongTab: React.FC<Props> = (props) => {
  const [sortedScoreArray, setSortedScoreArray] = useState<SongScore[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState<boolean[]>(new Array(10).fill(true));
  const [filterCrown, setFilterCrown] = useState<boolean[]>(new Array(4).fill(true));
  const [filterRank, setFilterRank] = useState<boolean[]>(new Array(8).fill(true));
  const [sortBy, setSortBy] = useState<'viewId' | 'name' | 'crown' | 'rank' | 'difficulty'>('viewId');
  const [sortDescending, setSortDescending] = useState<boolean>(false);
  const [filterSouuchi, setFilterSouuchi] = useState<boolean>(false);

  // 初期化時処理
  useEffect(() => {
    // フィルター設定読み込み
    const storageFilterDifficulty = localStorage.getItem("filterDifficulty");
    if (storageFilterDifficulty){
      setFilterDifficulty(JSON.parse(storageFilterDifficulty));
    }
    const storageFilterCrown = localStorage.getItem("filterCrown");
    if (storageFilterCrown){
      setFilterCrown(JSON.parse(storageFilterCrown));
    }
    const storageFilterRank = localStorage.getItem("filterRank");
    if (storageFilterRank){
      setFilterRank(JSON.parse(storageFilterRank));
    }
  }, []);

  // フィルター/ソート変更時処理
  useEffect(() => {
    setSortedScoreArray(props.scoreArray
      .filter(song => filterDifficulty[song.difficulty-1] && filterCrown[song.crown] && filterRank[song.rank===0 ? song.rank : song.rank-1] && !(!filterSouuchi && song.name.startsWith("【双打】")))
      .sort((a, b) => {
        const sortMultiplier = sortDescending ? -1 : 1;
        if (sortBy === 'viewId') {
          return sortMultiplier * (a.viewId - b.viewId);
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
  }, [props.scoreArray, filterDifficulty, filterCrown, filterRank, sortBy, sortDescending, filterSouuchi]);

  // 以下ソート/フィルター
  const toggleFilterDifficulty = (index: number) => {
    const updatedFilters = [...filterDifficulty];
    updatedFilters[index] = !updatedFilters[index];
    setFilterDifficulty(updatedFilters);
    localStorage.setItem("filterDifficulty", JSON.stringify(updatedFilters));
  };

  const toggleFilterCrown = (index: number) => {
    const updatedFilters = [...filterCrown];
    updatedFilters[index] = !updatedFilters[index];
    setFilterCrown(updatedFilters);
    localStorage.setItem("filterCrown", JSON.stringify(updatedFilters));
  };

  const toggleFilterRank = (index: number) => {
    const updatedFilters = [...filterRank];
    updatedFilters[index] = !updatedFilters[index];
    setFilterRank(updatedFilters);
    localStorage.setItem("filterRank", JSON.stringify(updatedFilters));
  };

  const toggleSortDescending = () => {
    setSortDescending(prev => !prev);
  };

  const toggleFilterSouuchi = () => {
    setFilterSouuchi(prev => !prev);
  };
  // 以上ソート/フィルター

  const alertRandomSong = () => {
    const song = sortedScoreArray[Math.floor(Math.random() * sortedScoreArray.length)];
    alert(`${song.name}\nクリア: ${CROWN[song.crown]}\nランク: ${song.rank===0 ? "ランクなし" : RANK[song.rank-1]}`);
  };

  return (
    <div>
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
              {<img src={CROWN_IMAGE[index]} alt={"crown"+index} style={{height:30}}/>}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div>
        <ToggleButtonGroup color="primary">
          {filterRank.slice(0, 4).map((selected, index) => (
            <ToggleButton selected={selected} value={index} onClick={() => toggleFilterRank(index)}>
              {index >= 1 ? <img src={RANK_IMAGE[index-1]} alt={"rank"+(index-1)} style={{height:30}}/> : "ランクなし"}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div>
        <ToggleButtonGroup color="primary">
          {filterRank.slice(4, 8).map((selected, index) => (
            <ToggleButton selected={selected} value={index+4} onClick={() => toggleFilterRank(index+4)}>
              <img src={RANK_IMAGE[index+3]} alt={"rank"+(index+3)} style={{height:30}}/>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <RadioGroup row aria-label="sort" name="sort" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
        <FormControlLabel value="viewId" control={<Radio />} label="選曲画面" />
        <FormControlLabel value="name" control={<Radio />} label="曲名" />
        <FormControlLabel value="difficulty" control={<Radio />} label="難易度" />
        <FormControlLabel value="crown" control={<Radio />} label="王冠" />
        <FormControlLabel value="rank" control={<Radio />} label="ランク" />
      </RadioGroup>
      <FormControlLabel
        control={<Checkbox checked={sortDescending} onChange={toggleSortDescending} />}
        label="降順にする"
      />
      <FormControlLabel
        control={<Checkbox checked={filterSouuchi} onChange={toggleFilterSouuchi} />}
        label="双打譜面を表示する"
      />
      <div>
        <Button variant="contained" onClick={alertRandomSong}>ランダム選曲</Button>
      </div>
      <ScoreTable scoreArray={sortedScoreArray} />
    </div>
  );
}

export default AllSongTab;
