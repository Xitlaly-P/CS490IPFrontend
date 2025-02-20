import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LandingPage from "./LandingPage";
import CustomerPage from "./CustomerPage";
import FilmsPage from "./FilmsPage";
import "./App.css"

function App() {
  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])
  return(
    <Router>
      <div> {/* This wraps both the navigation and data display */}
        {/* Navigation Menu */}
        <div className="sep">
          <nav>
            <ul className="nav">
              <li className="item"><Link to="/">Home</Link></li>
              <li className="item"><Link to="/customers">Customers</Link></li>
              <li className="item"><Link to="/films">Films</Link></li>
            </ul>
          </nav>
        </div>

        {/* Page Routes */}
        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/films" element={<FilmsPage />} />
          </Routes>
        </div>

        {/* <div>
          {typeof data.members === 'undefined' ? (
            <p>Loading...</p>
          ) : (
            data.members.map((member, i) => (
              <p key={i}>{member}</p>
            ))
          )}
        </div> */}


      </div>
    </Router>
  )
}

export default App