import React, { useState, useEffect } from "react";
import "./customerpage.css";
import { FaEdit, FaEye, FaTrash, FaTimes } from "react-icons/fa";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [modalType, setModalType] = useState(null); 
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    
  });
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);

  useEffect(() => {
      fetchCustomers();
  }, [page, search]);

  const fetchCustomers = async () => {
      try {
      const response = await fetch(
          `CustomerPage?page=${page}&limit=${limit}&search=${search}`
      );
      const data = await response.json();
      setCustomers(data.customers);
      setTotal(data.total);
      } catch (error) {
      console.error("Error fetching customers:", error);
      }
  };

  const fetchRentalHistory = async (customer_id) => {
    try {
      const response = await fetch(`/customer-rental-history/${customer_id}`);
      const data = await response.json();
      setRentalHistory(data.rental_history);
    } catch (error) {
      console.error("Error fetching rental history:", error);
    }
  };

  const openAddCustomerModal = () => {
    setModalType("add");
    setShowModal(true);
  };
  
  const openEditCustomerModal = (customer) => {
    setEditCustomer(customer);
    setModalType("edit");
    setShowModal(true);
  };
  
  const openViewCustomerModal = (customer) => {
    setSelectedCustomer(customer);
    fetchRentalHistory(customer.customer_id);
    setModalType("view");
    setShowModal(true);
  };
  

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page to 1
  };

  const handleAddCustomer = async () => {
    try {
      const response = await fetch("/add-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCustomer),
      });

      if (response.ok) {
        setShowModal(false); 
        setNewCustomer({ first_name: "", last_name: "", email: "" });
        fetchCustomers(); 
      }
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  
  const handleDeleteCustomer = async (customer_id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return; 
    }
  
    try {
      const response = await fetch("/delete-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_id }),
      });
  
      if (response.ok) {
        fetchCustomers(); 
      } else {
        console.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleUpdateCustomer = async () => {
    try {
      const response = await fetch("/update-customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCustomer),
      });
  
      if (response.ok) {
        setShowModal(false);
        setEditCustomer(null);
        fetchCustomers();
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };
  

  return (
    <div className='customerdiv'>
      <h2 className='logo'>Customer List</h2>
      {/* Search Input */}
      <div className='search-container'>
        <div className="search-box">
          <input
            type="text"
            placeholder=""
            value={search}
            onChange={handleSearchChange}
          />
          <span></span>
        </div>
  
        <button onClick={openAddCustomerModal} className="button-74">Add Customer</button>
      </div>

      {/* Customer Table */}
      <table className="container">
        <thead>
          <tr>
            <th><h1>Customer ID</h1></th>
            <th><h1>First Name</h1></th>
            <th><h1>Last Name</h1></th>
            <th><h1>Email</h1></th>
            <th><h1>Action</h1></th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.customer_id}>
                <td>{customer.customer_id}</td>
                <td>{customer.first_name}</td>
                <td>{customer.last_name}</td>
                <td>{customer.email}</td>
                <td>
                  <button onClick={() => openEditCustomerModal(customer)} className="icon-button"><FaEdit /></button>
                  <button onClick={() => openViewCustomerModal(customer)} className="icon-button"><FaEye /></button>
                  <button onClick={() => handleDeleteCustomer(customer.customer_id)} className="icon-button delete-icon"><FaTrash /></button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className='pagination'>
        <button className='button-74' disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span className="page"> Page {page} </span>
        <button className='button-74' disabled={customers.length < limit} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {showModal && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
        }}>
          {modalType === "view" && selectedCustomer && (
            <>
              <button onClick={() => setShowModal(false)} className="close-button"><FaTimes /></button>
              <div className="details">
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
              </div>

              <h4 className='rtitle'>Rental History:</h4>
              <div className="rental-table-container">
              <table className = 'rental-table'>
                <thead>
                  <tr>
                    <th>Rental ID</th>
                    <th>Title</th>
                    <th>Rental Date</th>
                    <th>Return Date</th>
                    <th>Returned</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalHistory.length > 0 ? (
                    rentalHistory.map((rental) => (
                      <tr key={rental.rental_id}>
                        <td>{rental.rental_id}</td>
                        <td>{rental.title}</td>
                        <td>{rental.rental_date}</td>
                        <td>{rental.return_date}</td>
                        <td>{rental.returned}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No rentals</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
              
            </>
          )}

          {(modalType === "add" || modalType === "edit") && (
            <>
              <div className="idk">
              <div className="modalae">
              <button onClick={() => { setShowModal(false); setEditCustomer(null); setModalType(null); }} className="close-button"><FaTimes /></button>
              <h3>{modalType === "edit" ? "Edit Customer" : "Add New Customer"}</h3>
              <div>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={modalType === "edit" ? editCustomer.first_name : newCustomer.first_name}
                  onChange={(e) =>
                    modalType === "edit"
                      ? setEditCustomer({ ...editCustomer, first_name: e.target.value })
                      : setNewCustomer({ ...newCustomer, first_name: e.target.value })
                  }
                />
              </div>
              <br />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={modalType === "edit" ? editCustomer.last_name : newCustomer.last_name}
                onChange={(e) =>
                  modalType === "edit"
                    ? setEditCustomer({ ...editCustomer, last_name: e.target.value })
                    : setNewCustomer({ ...newCustomer, last_name: e.target.value })
                }
              />
              <br />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={modalType === "edit" ? editCustomer.email : newCustomer.email}
                onChange={(e) =>
                  modalType === "edit"
                    ? setEditCustomer({ ...editCustomer, email: e.target.value })
                    : setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
              <br />
              <button class="button-28" onClick={modalType === "edit" ? handleUpdateCustomer : handleAddCustomer}>
                {modalType === "edit" ? "Update" : "Submit"}
              </button>
              </div>
              </div>
            </>
          )}
        </div>
      )}


    </div>


  );
}

export default CustomerPage;
