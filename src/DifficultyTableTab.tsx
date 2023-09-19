import React, { useEffect, useState } from 'react';
import ScoreTable from './ScoreTable';

interface Props {
  scoreArray: {[key:number]: SongScore};
};

const DifficultyTableTab: React.FC<Props> = (props) => {
  var scoreArray: (SongScore|Partition)[] = [];

  // ここでSongScoreとPartitionだけの配列を作りScoreTableに渡せばOK

  return (
    <div>
      <ScoreTable scoreArray={scoreArray} />
    </div>
  );
}

export default DifficultyTableTab;
