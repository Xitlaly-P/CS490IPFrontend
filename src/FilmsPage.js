import React, { useState, useEffect } from "react";
import "./films.css";
import {FaEye, FaTimes} from "react-icons/fa";

function FilmsPage() {
  const [films, setFilms] = useState([]); // Ensure default is an empty array
  const [totalFilms, setTotalFilms] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const limit = 10; // Number of films per page

  useEffect(() => {
    fetchFilms();
  }, [search, page]); // Fetch films when search query or page changes

  const fetchFilms = async () => {
    try {
      const url = search
        ? `/search-films?search=${search}&page=${page}&limit=${limit}`
        : `/search-films?page=${page}&limit=${limit}`;
      const response = await fetch(url);
      const data = await response.json();
      setFilms(data.films);
      setTotalFilms(data.total); // Set total number of films
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const totalPages = Math.ceil(totalFilms / limit);

  const openModal = (film) => {
    setSelectedFilm(film);
  };

  const closeModal = () => {
    setSelectedFilm(null);
  };

  return (
    <div className="titlediv">
      <h2>Films</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Film, Actor, or Genre"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to first page on new search
        }}
      />

      {/* Display Results */}
      {films && Array.isArray(films) && films.length > 0 ? (
        <div className='filmsdiv'>
          <table className="container">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Year</th>
                <th>Rating</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {films.map((film) => (
                <tr key={film.film_id}>
                  <td>{film.title}</td>
                  <td>{film.category}</td>
                  <td>{film.release_year}</td>
                  <td>{film.rating}</td>
                  <td>
                    <button onClick={() => openModal(film)} className="icon-button"><FaEye /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No films found.</p>
      )}

      {selectedFilm && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={closeModal} className="close-button"><FaTimes /></button>
            <h2>{selectedFilm.title}</h2>
            <p><strong>Category:</strong> {selectedFilm.category}</p>
            <p><strong>Year:</strong> {selectedFilm.release_year}</p>
            <p><strong>Rating:</strong> {selectedFilm.rating}</p>
            <p><strong>Description:</strong> {selectedFilm.description}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default FilmsPage;
