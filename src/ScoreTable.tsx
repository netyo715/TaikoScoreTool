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

const ScoreTable: React.FC<Props> = ({ songList }) => {
  const [filterCrown, setFilterCrown] = useState<boolean[]>(new Array(4).fill(true));
  const [filterRank, setFilterRank] = useState<boolean[]>(new Array(8).fill(true));
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'crown' | 'rank'>('id');
  const [sortDescending, setSortDescending] = useState<boolean>(false);

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
