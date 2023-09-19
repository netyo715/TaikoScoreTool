type JsonSongScore = {
    name: string;
    isUra: boolean;
    crown: number;
    rank: number;
}

type SongScore = {
  type: "SongScore";
  viewId: number;
  id: number;
  name: string;
  mainGenre: number;
  genre: number[];
  difficulty: number;
  crown: number;
  rank: number;
}

type SongInfo = {
  viewId: number;
  id: number;
  name: string;
  isUra: boolean;
  mainGenre: number;
  genre: number[];
  difficulty: number;
}

type Partition = {
  type: "Partition";
  name: number;
}