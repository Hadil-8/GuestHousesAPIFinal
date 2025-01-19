import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Guesthouses() {
  const [guesthouses, setGuesthouses] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/GuestHouses/")
      .then((response) => setGuesthouses(response.data))
      .catch((error) => console.error("Error fetching guesthouses:", error));
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mt-4 mb-4">Guesthouses</h1>
      <Link to="/guesthouses/add" className="btn btn-primary mb-3">
        Add Guesthouse
      </Link>
      <div className="row">
        {guesthouses.map((guesthouse) => (
          <div key={guesthouse.GuestHouse_id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{guesthouse.Name}</h5>
                <p className="card-text">Region: {guesthouse.Region}</p>
                <Link to={`/guesthouses/${guesthouse.GuestHouse_id}`} className="btn btn-outline-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Guesthouses;
