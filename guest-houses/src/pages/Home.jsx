import React from "react";

function Home() {
  return (
    <div
      className="container mt-5 d-flex flex-column align-items-center justify-content-center"
      style={{
        position: "relative",
        height: "100vh", // Adjust based on your desired height
      }}
    >
      {/* Background Image with Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("tuni.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.8, // Adjust opacity here
          zIndex: 0, // Make sure the overlay is behind the content
        }}
      />
      
      <h1 style={{zIndex:1}} className="text-center text-dark ms-3">Welcome to Our Guesthouse App!</h1>
      <p style={{zIndex:1}} className="text-center text-white ms-3">Discover amazing guesthouses and exciting activities.</p>
    </div>
  );
}

export default Home;
