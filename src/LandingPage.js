import React, { useState, useEffect } from "react";
import "./landing.css";

function LandingPage() {
  const [actors, setActors] = useState([]); // Store actors
  const [movies, setMovies] = useState([]);
  //const [selectedActor, setSelectedActor] = useState(null);

  useEffect(() => {
    fetchActors();
    fetchMovies();
  }, []);

  const fetchActors = async () => {
    try {
      const response = await fetch("/top-actors"); // Add an endpoint to get top actors (modify as per your API)
      const data = await response.json();
      setActors(data); // Update actors data
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await fetch("/top-movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
  
  return (
    <div className='titlediv'>
      <h2>Welcome to the Rental Store</h2>
      <h3>Top 5 Movies</h3>
      <div className="five">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div className="card" key={movie.film_id}>
              <div className="content">
                <div className="front">
                  <h4>{movie.title}</h4>
                </div>
                <div className="back">
                  <p><strong>Released:</strong> {movie.release_year}</p>
                  <p><strong>Rating:</strong> {movie.rating}</p>
                  <p><strong>Description:</strong> {movie.description}</p>
                  <p><strong>Rented:</strong> {movie.rented_count} times</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading movies...</p>
        )}
      </div>

      <h3>Top 5 Actors</h3>
      <div className="five">
        {actors.length > 0 ? (
          actors.map((actor) => (
            <div className="card" key={actor.actor_id}>
              <div className="content">
                <div className="front">
                  <h4>{actor.first_name} {actor.last_name}</h4>
                </div>
                <div className="back">
                  <h6>Top 5 Rented Films:</h6>
                  <ul>
                    {actor.top_films?.map((film) => (
                      <li key={film.film_id}>{film.title} ({film.rental_count} rentals)</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Loading actors...</p>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
