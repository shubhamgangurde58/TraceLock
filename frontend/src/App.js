import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Admindashboard from "./pages/Admindashboard";
import Employeedashboard from "./pages/Employeedashboard";
import ForgotPassword  from "./pages/Forgotpassword";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<LandingPage />} />
        <Route path="/login"  element={<LoginPage />}   />
        <Route path="/signup" element={<SignupPage />}  />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/dashboard" element={<Admindashboard />} />
        <Route path="/employee/dashboard" element={<Employeedashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

