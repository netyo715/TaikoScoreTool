import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';

interface SongScore {
  id: number;
  name: string;
  mainGenre: number;
  genre: number[];
  difficulty: number;
  crown: number;
  rank: number;
};

interface Props {
  scoreArray: SongScore[];
};

const ScoreTable: React.FC<Props> = (props) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>曲名</TableCell>
              <TableCell>難易度</TableCell>
              <TableCell>王冠</TableCell>
              <TableCell>ランク</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.scoreArray.map(song => (
              <TableRow>
                <TableCell>{song.name}</TableCell>
                <TableCell>{song.difficulty}</TableCell>
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
