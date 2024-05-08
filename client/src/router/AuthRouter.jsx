import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import Home from "../components/Home";
import PhoneLogin from "../components/PhoneLogin";

function AuthRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AuthRouter;
