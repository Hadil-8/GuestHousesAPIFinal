import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddActivity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    Activity_id: "",
    Name: "",
    Description: "",
    Type: "",
    Region: "",
    City: "",
    Price: 0,
  });

  // Fetch activity data for editing
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Replace with actual method to get the token
  if (!token) {
    console.error("No token found");
    return;
  }else{
    console.log("token:", token);
    
  }
    if (id) {
      axios
        .get(`http://127.0.0.1:8000/Activities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setForm(response.data))
        .catch((error) => console.error("Error fetching activity:", error));
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken"); // Replace with actual token
    const apiCall = id
      ? axios.put(`http://127.0.0.1:8000/Activities/${id}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      : axios.post("http://127.0.0.1:8000/Activities/", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    apiCall
      .then(() => navigate("/activities"))
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      });
  };

  return (
    <div className="container mt-5">
      <h1>{id ? "Edit Activity" : "Add Activity"}</h1>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Activity ID</label>
          <input
            type="text"
            className="form-control"
            placeholder="Activity ID"
            value={form.Activity_id}
            onChange={(e) =>
              setForm({ ...form, Activity_id: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={form.Name}
            onChange={(e) => setForm({ ...form, Name: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            placeholder="Description"
            value={form.Description}
            onChange={(e) =>
              setForm({ ...form, Description: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <input
            type="text"
            className="form-control"
            placeholder="Type"
            value={form.Type}
            onChange={(e) => setForm({ ...form, Type: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Region</label>
          <input
            type="text"
            className="form-control"
            placeholder="Region"
            value={form.Region}
            onChange={(e) => setForm({ ...form, Region: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            placeholder="City"
            value={form.City}
            onChange={(e) => setForm({ ...form, City: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={form.Price}
            onChange={(e) => setForm({ ...form, Price: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-success">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default AddActivity;
