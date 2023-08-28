import './App.css';
import ScoreTable from './ScoreTable';
function App() {
  const songList = [{id:1, name:"aiueo", crown:1, rank:1}, {id:2, name:"kakikukeko", crown:0, rank:2}, {id:3, name:"bakikukeko", crown:3, rank:7}];
  return (
    <div className="App">
      <ScoreTable songList={songList}></ScoreTable>
    </div>
  );
}

export default App;
