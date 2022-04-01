import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <ul>
      <li>
        <Link to='/traffic'>Traffic Lights</Link>
      </li>
      <li>
        <Link to='/jokes'>Jokes</Link>
      </li>
      <li>
        <Link to='/library'>Library</Link>
      </li>
      <li>
        <Link to='/starwars'>Star Wars</Link>
      </li>
      <li>
        <Link to='/JHarry'>JHarry</Link>
      </li>
    </ul>
  );
}
