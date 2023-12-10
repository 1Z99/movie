import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import SearchIcon from "./search.svg";
import "./App.css";
import CustomDropdown from './CustomDropdown';

const API_URL = "https://www.omdbapi.com?apikey=b2c1ae58";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movieType, setMovieType] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    searchMovies("Naruto");
  }, []);

  const searchMovies = async (title, page = 1) => {
    setLoading(true);
    let apiUrl = `${API_URL}&s=${title}&page=${page}`;

    if (movieType) {
      apiUrl += `&type=${movieType}`;
    }

    if (releaseYear) {
      apiUrl += `&y=${releaseYear}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.Search) {
      const movieData = await Promise.all(
        data.Search.map(async (movie) => {
          const movieInfoUrl = `${API_URL}&i=${movie.imdbID}&plot=short`;
          const movieInfoResponse = await fetch(movieInfoUrl);
          const movieInfoData = await movieInfoResponse.json();
          return {
            ...movie,
            plot: movieInfoData.Plot || "",
          };
        })
      );

      setMovies(movieData);
      setCurrentPage(page);

      const total = Math.ceil(Number(data.totalResults) / 1);
      setTotalPages(total);
      setLoading(false);
    } else {
      setMovies([]);
      setCurrentPage(1);
      setTotalPages(1);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchMovies(searchTerm);
    }
  };

  const goToPage = (page) => {
    searchMovies(searchTerm, page);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      goToPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 1) {
      goToPage(prevPage);
    }
  };

  const movieTypeOptions = [
    { label: 'MOVIE', value: 'MOVIE' },
    { label: 'SERIES', value: 'SERIES' },
  ];

  const yearOptions = [{ label: 'ALL', value: '' }];
  for (let year = 1900; year <= 2023; year++) {
    yearOptions.push({ label: year.toString(), value: year.toString() });
  }
  
  const handleTitleClick = () => {
    setSearchTerm("");
    setMovies([]);
    setMovieType("");
    setReleaseYear("");
    setCurrentPage(1);
  };
  return (
    <div className="app">
      <div style={{ textAlign: 'center' }}>
        <h1 onClick={handleTitleClick}>
          A R T R C <span style={{ verticalAlign: 'middle' }}><img className="logo" src="https://i.imgur.com/l4m41WG.png" alt="Number 3"/></span> M O V I E S
        </h1>
      </div>
     {/* nawzat @1z99 github */}

      <div className="search" >
         <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="ごめん！"
            style={{
               padding: '8px', 
               fontSize: '20px', 
               color: 'black', 
               
            }}
            />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      <div className="advanced-search">
        <CustomDropdown
          options={movieTypeOptions}
          value={movieType}
          onChange={(e) => setMovieType(e.target.value)}
        />
        <CustomDropdown
          options={yearOptions}
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button onClick={() => searchMovies(searchTerm)}>SEARCH</button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading"></div>
        </div>
      )}


      {movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No movies found, Search another title ごめん! </h2>
        </div>
      )}

      {searchTerm && movies.length > 0 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={handlePrevPage}>
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={handleNextPage}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
