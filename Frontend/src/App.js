import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './components/Login';
import Header from './components/Header';
import Home from './components/Home';
import CustomToastContainer from './components/CustomToastContainer';
import Detail from './components/Detail';
import SeriesPage from './Pages/SeriesPage';
import { useSelector } from 'react-redux';
import SearchResultsPage from './Pages/SearchPage';
import MoviesPage from './Pages/MoviePage';
import SeriesDetail from './components/SeriesDetail';
import OriginalPage from './Pages/OriginalPage';
import DisneyPage from './Pages/DisneyPage';
import MarvelPage from './Pages/MarvelPage';
import PixarPage from './Pages/PixarPage';
import StarWarsPage from './Pages/StarWarsPage';
import ParamountPage from './Pages/ParamountPage';
import Watchlist from './Pages/WatchList';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route
            path='/'
            element={user ? <Navigate to='/home' /> : <Login />}
          />

          {user ? (
            <>
              <Route path='/home' element={<Home />} />
              <Route path='/movies' element={<MoviesPage />} />
              <Route path='/movies/disney' element={<DisneyPage />} />
              <Route path='/movies/marvel' element={<MarvelPage />} />
              <Route path='/movies/pixar' element={<PixarPage />} />
              <Route path='/movies/starwars' element={<StarWarsPage />} />
              <Route path='/movies/paramount' element={<ParamountPage />} />
              <Route path='/originals' element={<OriginalPage />} />
              <Route path='/watchlist' element={<Watchlist />} />
              <Route path='/movies/:id' element={<Detail />} />
              <Route path='/series/:id' element={<SeriesDetail />} />
              <Route path='/search' element={<SearchResultsPage />} />
              <Route path='/series' element={<SeriesPage />} />
              <Route path='*' element={<Navigate to='/home' />} />
            </>
          ) : (
            <Route path='*' element={<Navigate to='/' />} />
          )}
        </Routes>
      </Router>
      <CustomToastContainer />
    </>
  );
}
export default App;
