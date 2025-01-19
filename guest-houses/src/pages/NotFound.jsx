import React from "react";

function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <img
        src="/404_page-not-found.png"
        alt="Page Not Found"
        style={{ maxWidth: "89%", height: "auto" }}
      />
      <h1 className="mt-3">Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default NotFound;
