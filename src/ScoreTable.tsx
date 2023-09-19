import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';

import "./ScoreTable.css";

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

const CROWN_IMAGE = [crown0, crown1, crown2, crown3];
const RANK_IMAGE = [rank2, rank3, rank4, rank5, rank6, rank7, rank8];

interface Props {
  scoreArray: (SongScore | Partition)[];
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
            {props.scoreArray.map(song => {
              if (song.type === "SongScore"){
                return (
                <TableRow className={"genre"+song.mainGenre}>
                  <TableCell>{song.name}</TableCell>
                  <TableCell>{"☆" + song.difficulty}</TableCell>
                  <TableCell><img src={CROWN_IMAGE[song.crown]} alt={"crown"+song.crown} style={{height:30}}/></TableCell>
                  <TableCell>{(song.rank >= 2) ? <img src={RANK_IMAGE[song.rank-2]} alt={"rank"+(song.rank-2)} style={{height:30}}/> : <></>}</TableCell>
                </TableRow>
                )
              }else{
                return (
                  <TableRow>
                    <TableCell>{song.name}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  )
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ScoreTable;
