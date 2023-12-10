import React, { useState, useEffect } from 'react';

const MovieCard = ({ movie }) => {
  const { imdbID, Year, Poster, Title, Type } = movie;
  const [plot, setPlot] = useState('');
  const [showPlot, setShowPlot] = useState(false);
  const [trailerLink, setTrailerLink] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchPlot = async () => {
      const API_URL = `https://www.omdbapi.com?apikey=b2c1ae58&i=${imdbID}&plot=short`;
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setPlot(data.Plot || '');
      } catch (error) {
        console.error('Error fetching plot:', error);
      }
    };

    fetchPlot();
  }, [imdbID]);

  const fetchTrailer = async (title, year) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=AIzaSyA0entNbxGGL5Z4ngsRb6b8hd0BjIKtPqE&q=${title} ${year} trailer`

      );

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const trailerId = data.items[0].id.videoId;
        setTrailerLink(`https://www.youtube.com/watch?v=${trailerId}`);
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const handleTrailerClick = () => {
    if (!trailerLink) {
      fetchTrailer(Title, Year);
    }
    setShowTrailer(!showTrailer);
  };

  return (
    
    <div className="movie-card" key={imdbID}>
      <div className="movie">
        <div>
        </div>
        <div>
          <img src={Poster !== 'N/A' ? Poster : 'https://via.placeholder.com/400'} alt={Title} />
        </div>
        <p className="year">{Year}</p>
        <div>
          <span>{Type}</span>
          <h3>{Title}</h3>
          <p className="plot">{plot}</p>
        </div>
      </div>
      <p className="trailer-button">
        <button onClick={handleTrailerClick}>
          {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
        </button>
        {showTrailer && trailerLink && (
          <a href={trailerLink} target="_blank" rel="noopener noreferrer">
            Watch Trailer
          </a>
        )}
      </p>
    </div>
  );
};

export default MovieCard;

