import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/home';
import Dashboard from './Components/JHerry/Dashboard';
import JokeSearch from './Components/joke-search/Joke-search';
import Library from './Components/Library/Library';
import StarWars from './Components/StarWars/StarWars';
import TrafficLight from './Components/traffic-light/traffic-light';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/traffic' element={<TrafficLight />} />
      <Route path='/jokes' element={<JokeSearch />} />
      <Route path='/library' element={<Library />} />
      <Route path='/starwars' element={<StarWars />} />
      <Route path='/JHarry' element={<Dashboard />} />
    </Routes>
  );
}

export default App;
