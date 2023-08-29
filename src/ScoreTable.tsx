import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

interface SongData {
  id: number;
  name: string;
  crown: number;
  rank: number;
}

interface Props {
  songList: SongData[];
}

const CROWN = ["未クリア", "クリア", "フルコンボ", "ドンダフルコンボ"];
const RANK = ["ランクなし", "粋1", "粋2", "粋3", "雅1", "雅2", "雅3", "極"];

const ScoreTable: React.FC<Props> = (props) => {
  const [filterCrown, setFilterCrown] = useState<boolean[]>(new Array(4).fill(true));
  const [filterRank, setFilterRank] = useState<boolean[]>(new Array(9).fill(true));
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'crown' | 'rank'>('id');
  const [sortDescending, setSortDescending] = useState<boolean>(false);
  const [songList, setSongList] = useState<{id:number, name:string, crown:number, rank:number}[]>([]);

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

  const copyScript = () => {
    navigator.clipboard.writeText('javascript:void(async function(){results=await async function(){for(var g=[],e=1;e<=8;e++){var t="https://donderhiroba.jp/score_list.php?genre="+e.toString();await fetch(t).then(e=>e.text()).then(e=>{const t=new DOMParser,n=t.parseFromString(e,"text/html");for(var a=n.getElementById("songList").getElementsByClassName("contentBox"),r=["played","silver","gold","donderfull"],s=0;s<a.length;s++){var o=a[s],l={songName:"",isUra:!1,crown:0,rank:0};l.songName=o.getElementsByClassName("songName")[0].textContent;for(var c=(o.getElementsByClassName("songNameArea")[0].classList.contains("ura")?(l.isUra=!0,o.getElementsByClassName("crown")[0]):o.getElementsByClassName("crown")[3]).getAttribute("src").replace("image/sp/640/crown_button_","").replace("_640.png",""),i=0;i<r.length;i++)c.includes(r[i])&&(l.crown=i);for(i=0;i<=8;i++)c.includes(i.toString())&&(l.rank=i);g.push(l)}}).catch(e=>{console.log(e)})}return g}();var e=document.createElement("button");e.textContent="クリップボードにコピー",e.addEventListener("click",function(){navigator.clipboard.writeText(JSON.stringify(results,null,"")).then(()=>{alert("copy success")},()=>{alert("copy failed")})});var t=document.getElementsByTagName("img")[0];document.body.insertBefore(e,t)}());').then(
    () => {alert("copy success");},
    () => {alert("copy failed");}
    );
  }

  const inputScore = () => {
    const data = prompt("データを入力");
    if (!data){
      return;
    }
    var result = [];
    const parsedJson: {songName: string, isUra: boolean, crown: number, rank: number}[] = JSON.parse(data);
    for (var i=0; i<parsedJson.length; i++){
      result.push({id: i, name: parsedJson[i].songName, crown: parsedJson[i].crown, rank: parsedJson[i].rank});
    }
    setSongList(result);
  }

  const sortedSongs = songList
    .filter(song => filterCrown[song.crown] && filterRank[song.rank])
    .sort((a, b) => {
      const sortMultiplier = sortDescending ? -1 : 1;
      if (sortBy === 'id') {
        return sortMultiplier * (a.id - b.id);
      } else if (sortBy === 'name') {
        return sortMultiplier * a.name.localeCompare(b.name);
      } else if (sortBy === 'crown') {
        return sortMultiplier * (a.crown - b.crown);
      } else {
        return sortMultiplier * (a.rank - b.rank);
      }
    });

  return (
    <div>
      <div>
        <Button onClick={copyScript}>ブックマークレットをコピー</Button>
        <p>適当なWebページをブックマークに登録し、URLをコピーしたブックマークレットに置き換えてください</p>
        <Button onClick={inputScore}>スコア貼り付け</Button>
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
        <FormControlLabel value="crown" control={<Radio />} label="王冠" />
        <FormControlLabel value="rank" control={<Radio />} label="ランク" />
      </RadioGroup>
      <FormControlLabel
        control={<Checkbox checked={sortDescending} onChange={toggleSortDescending} />}
        label="降順にする"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>曲名</TableCell>
              <TableCell>王冠</TableCell>
              <TableCell>ランク</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSongs.map(song => (
              <TableRow>
                <TableCell>{song.name}</TableCell>
                <TableCell>{song.crown}</TableCell>
                <TableCell>{song.rank}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ScoreTable;
