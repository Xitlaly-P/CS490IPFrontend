import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./films.css";
import {FaEye, FaTimes} from "react-icons/fa";

function FilmsPage() {
  const [films, setFilms] = useState([]); 
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [filmToRent, setFilmToRent] = useState(null);
  const limit = 10; 

  useEffect(() => {
    fetchFilms();
  }, [search, page]);

  const fetchFilms = async () => {
    try {
      const response = await fetch(`/search-films?page=${page}&limit=${limit}&search=${search}`);
      const data = await response.json();
      setFilms(data.films);
    } catch (error) {
      console.error("Error fetching films:", error);
    }
  };

  const openRentModal = (film) => {
    setFilmToRent(film);
    setIsRentModalOpen(true);
  };

  const closeRentModal = () => {
    setIsRentModalOpen(false);
    setCustomerId("");
    setFilmToRent(null);
  };

  
  const handleRent = async () => {
    if (!customerId.trim()) {
      toast.error("Please enter a valid Customer ID.");
      return;
    }

    try {
      const response = await fetch("/rent-film", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ film_id: filmToRent.film_id, customer_id: customerId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Rental successful! 🎉");
        fetchFilms(); 
        closeRentModal();
      } else {
        toast.error(data.message || "Rental failed. ❌");
      }
    } catch (error) {
      console.error("Error renting film:", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };


  const openModal = (film) => {
    setSelectedFilm(film);
  };

  const closeModal = () => {
    setSelectedFilm(null);
  };

  return (
    <div className="titlediv">
      <h2>Films</h2>
      <ToastContainer position="bottom-right" autoClose={3000} />
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Film, Actor, or Genre"
        value={search}
        onChange={handleSearchChange}
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
                <th>Available Copies</th>
                <th>View</th>
                <th>Rent</th>
              </tr>
            </thead>
            <tbody>
              {films.map((film) => (
                <tr key={film.film_id}>
                  <td>{film.title}</td>
                  <td>{film.category}</td>
                  <td>{film.release_year}</td>
                  <td>{film.rating}</td>
                  <td>{film.available_copies}</td>
                  <td>
                    <button onClick={() => openModal(film)} className="icon-button"><FaEye /></button>
                  </td>
                  <td><button className="button-2" onClick={() => openRentModal(film)}>Rent</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className='pagination'>
            <button className='button-74' disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span className="page"> Page {page} </span>
            <button className='button-74' disabled={films.length < limit} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>
      ) : (
        <p>No films found.</p>
      )}
      {/* Rent Modal */}
      {isRentModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="closetop"><button className="close-button" onClick={closeRentModal}><FaTimes /></button></div>
            <h2 className='modaltitle'>Rent {filmToRent.title}</h2>
            <label>Enter Customer ID:</label>
            <input id='porque'
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Customer ID"
            />
            <div className="modal-actions">
              <button className="button-2" onClick={handleRent}>Confirm Rental</button>
              <button className="button-2" onClick={closeRentModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {selectedFilm && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={closeModal} className="close-button"><FaTimes /></button>
            <h2 className='modaltitle'>{selectedFilm.title}</h2>
            <p><strong>Category:</strong> {selectedFilm.category}</p>
            <p><strong>Year:</strong> {selectedFilm.release_year}</p>
            <p><strong>Rating:</strong> {selectedFilm.rating}</p>
            <p><strong>Description:</strong> {selectedFilm.description}</p>
            <p><strong>Length:</strong> {selectedFilm.length} minutes</p>
            <p><strong>Replacement Cost:</strong> {selectedFilm.replacement_cost}</p>
            <p><strong>Featured Actors:</strong> {selectedFilm.featured_actors}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default FilmsPage;
