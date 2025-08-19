import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from "./pages/Signup.jsx";
import Leaderboard from "./pages/stleaderboard.jsx";
import Login from "./pages/login.jsx";
import Profile from "./pages/profile.jsx";

export default function App() {
  return (
    <Router>
      

      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
