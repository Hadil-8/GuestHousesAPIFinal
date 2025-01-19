import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddGuesthouse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    GuestHouse_id: "",
    Name: "",
    Region: "",
    City: "",
    Address: "",
    Description: "",
    Phone: "",
    EcoCertification: false,
    PricePerNight: 0,
  });

  const [error, setError] = useState("");

  // Retrieve the token from localStorage
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (id) {
      axios
        .get(`http://127.0.0.1:8000/GuestHouses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setForm(response.data))
        .catch((error) => {
          console.error("Error fetching guesthouse:", error);
          setError("Failed to fetch guesthouse data. Please try again.");
        });
    }
  }, [id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiCall = id
      ? axios.put(`http://127.0.0.1:8000/GuestHouses/${id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      : axios.post("http://127.0.0.1:8000/GuestHouses/", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    apiCall
      .then(() => navigate("/guesthouses"))
      .catch((error) => {
        console.error("Error saving guesthouse:", error);
        setError("Failed to save guesthouse data. Please try again.");
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="container mt-5">
      <h1>{id ? "Edit Guesthouse" : "Add Guesthouse"}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">GuestHouse ID</label>
          <input
            type="text"
            className="form-control"
            name="GuestHouse_id"
            placeholder="GuestHouse ID"
            value={form.GuestHouse_id}
            onChange={handleChange}
            required={!id} // Only required for creating a new guesthouse
            disabled={!!id} // Disable editing for existing guesthouses
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="Name"
            placeholder="Name"
            value={form.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Region</label>
          <input
            type="text"
            className="form-control"
            name="Region"
            placeholder="Region"
            value={form.Region}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            name="City"
            placeholder="City"
            value={form.City}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            name="Address"
            placeholder="Address"
            value={form.Address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="Description"
            placeholder="Description"
            value={form.Description}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            name="Phone"
            placeholder="Phone"
            value={form.Phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price Per Night</label>
          <input
            type="number"
            className="form-control"
            name="PricePerNight"
            placeholder="Price Per Night"
            value={form.PricePerNight}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="EcoCertification"
            id="EcoCertification"
            checked={form.EcoCertification}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="EcoCertification">
            Eco Certification
          </label>
        </div>
        <button type="submit" className="btn btn-success">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default AddGuesthouse;
