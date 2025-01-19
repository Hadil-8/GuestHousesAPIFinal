import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/Activities/${id}`)
      .then(response => setActivity(response.data))
      .catch(error => console.error("Error fetching activity details:", error));
  }, [id]);

  const handleDelete = () => {
  const token = localStorage.getItem("authToken"); // or retrieve from context or state

  axios.delete(`http://127.0.0.1:8000/Activities/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token in the Authorization header
    },
  })
    .then(() => navigate("/activities"))
    .catch(error => console.error("Error deleting activity:", error));
};


  if (!activity) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">{activity.Name}</h1>
      <ul className="list-group mb-4">
        <li className="list-group-item"><strong>Activity ID:</strong> {activity.Activity_id}</li>
        <li className="list-group-item"><strong>Type:</strong> {activity.Type}</li>
        <li className="list-group-item"><strong>Region:</strong> {activity.Region}</li>
        <li className="list-group-item"><strong>City:</strong> {activity.City}</li>
        <li className="list-group-item"><strong>Description:</strong> {activity.Description}</li>
        <li className="list-group-item"><strong>Price:</strong> ${activity.Price}</li>
      </ul>
      <div className="d-flex">
        <Link to={`/activities/edit/${id}`} className="btn btn-warning me-2">Edit</Link>
        <button onClick={handleDelete} className="btn btn-danger">Delete</button>
        <Link to="/activities" className="btn btn-secondary ms-2">Back to List</Link>
      </div>
    </div>
  );
}

export default ActivityDetails;
