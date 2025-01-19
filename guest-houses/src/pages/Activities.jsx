import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Activities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/Activities/")
      .then(response => setActivities(response.data))
      .catch(error => console.error("Error fetching activities:", error));
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Activities</h1>
      <Link to="/activities/add" className="btn btn-primary mb-3">Add Activity</Link>
      <div className="row">
        {activities.map(activity => (
          <div key={activity.Activity_id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{activity.Name}</h5>
                <p className="card-text">Region: {activity.Region}</p>
                <Link to={`/activities/${activity.Activity_id}`} className="btn btn-outline-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activities;
