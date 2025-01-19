import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function GuesthouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guesthouse, setGuesthouse] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/GuestHouses/${id}`)
      .then(response => setGuesthouse(response.data))
      .catch(error => console.error("Error fetching guesthouse details:", error));
  }, [id]);

  const handleDelete = () => {
  const token = localStorage.getItem("authToken"); // Replace with your token retrieval logic
  axios.delete(`http://127.0.0.1:8000/GuestHouses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => navigate("/guesthouses"))
    .catch(error => console.error("Error deleting guesthouse:", error));
};


  if (!guesthouse) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{guesthouse.Name}</h1>
      <ul className="list-group mb-4">
        <li className="list-group-item"><strong>Region:</strong> {guesthouse.Region}</li>
        <li className="list-group-item"><strong>Address:</strong> {guesthouse.Address}</li>
        <li className="list-group-item"><strong>Email:</strong> {guesthouse.City}</li>
        <li className="list-group-item"><strong>Contact Number:</strong> {guesthouse.Phone}</li>
        <li className="list-group-item"><strong>Price per Night:</strong> ${guesthouse.PricePerNight}</li>
        <li className="list-group-item"><strong>Eco Friendly ?</strong> {guesthouse.Amenities ? "Yes" : "No"}</li>
        <li className="list-group-item"><strong>Description:</strong> {guesthouse.Description}</li>
      </ul>
      <div className="d-flex">
        <Link to={`/guesthouses/edit/${id}`} className="btn btn-warning me-2">Edit</Link>
        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        <Link to="/guesthouses" className="btn btn-secondary ms-2">Back to List</Link>
      </div>
    </div>
  );
}

export default GuesthouseDetails;
