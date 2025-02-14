import React, { useState, useEffect } from "react";

function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    
  });
  const [editCustomer, setEditCustomer] = useState(null);

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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset page to 1
  };

  const handleInputChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
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
        setShowModal(false); // Close the modal
        setNewCustomer({ first_name: "", last_name: "", email: "" }); // Reset form
        fetchCustomers(); // Refresh the customer list
      }
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  
  const handleDeleteCustomer = async (customer_id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return; // If user cancels, do nothing
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
        fetchCustomers(); // Refresh list after deletion
      } else {
        console.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEditCustomer = (customer) => {
    setEditCustomer(customer);
    setShowModal(true); // Open the modal
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
        fetchCustomers(); // Refresh the customer list
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };
  

  return (
    <div>
      <h2>Customer List</h2>

      {/* Search Input */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by ID, first or last name"
          value={search}
          onChange={handleSearchChange}
        />
        <button onClick={() => setShowModal(true)}>ADD</button>
      </div>

      {/* Customer Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Action</th>
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
                <td><button onClick={() => handleEditCustomer(customer)}>EDIT</button>
                <button onClick={() => handleDeleteCustomer(customer.customer_id)}>DELETE</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      <span> Page {page} </span>
      <button disabled={customers.length < limit} onClick={() => setPage(page + 1)}>
        Next
      </button>


      {showModal && (
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
      }}>
        <h3>{editCustomer ? "Edit Customer" : "Add New Customer"}</h3>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={editCustomer ? editCustomer.first_name : newCustomer.first_name}
          onChange={(e) =>
            editCustomer
              ? setEditCustomer({ ...editCustomer, first_name: e.target.value })
              : setNewCustomer({ ...newCustomer, first_name: e.target.value })
          }
        />
        <br />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={editCustomer ? editCustomer.last_name : newCustomer.last_name}
          onChange={(e) =>
            editCustomer
              ? setEditCustomer({ ...editCustomer, last_name: e.target.value })
              : setNewCustomer({ ...newCustomer, last_name: e.target.value })
          }
        />
        <br />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={editCustomer ? editCustomer.email : newCustomer.email}
          onChange={(e) =>
            editCustomer
              ? setEditCustomer({ ...editCustomer, email: e.target.value })
              : setNewCustomer({ ...newCustomer, email: e.target.value })
          }
        />
        <br />
        <button onClick={editCustomer ? handleUpdateCustomer : handleAddCustomer}>
          {editCustomer ? "Update" : "Submit"}
        </button>
        <button onClick={() => { setShowModal(false); setEditCustomer(null); }}>Cancel</button>
      </div>
      )}

    </div>


  );
}

export default CustomerPage;
