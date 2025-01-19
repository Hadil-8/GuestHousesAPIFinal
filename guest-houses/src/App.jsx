import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Guesthouses from "./pages/Guesthouses";
import GuesthouseDetails from "./pages/GuesthouseDetails";
import AddGuesthouse from "./pages/AddGuesthouse";
import Activities from "./pages/Activities";
import ActivityDetails from "./pages/ActivityDetails";
import AddActivity from "./pages/AddActivity";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guesthouses" element={<Guesthouses />} />
        <Route path="/guesthouses/:id" element={<GuesthouseDetails />} />
        <Route path="/guesthouses/add" element={<AddGuesthouse />} />
        <Route path="/guesthouses/edit/:id" element={<AddGuesthouse />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/:id" element={<ActivityDetails />} />
        <Route path="/activities/add" element={<AddActivity />} />
        <Route path="/activities/edit/:id" element={<AddActivity />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
