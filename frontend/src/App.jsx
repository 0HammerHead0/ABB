import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Singup } from "./pages/Signup/Singup";
import { Login } from "./pages/Login/Login";
import { Home } from "./pages/Home/Home";
import { SignupSuccessfull } from "./components/SignupSuccessfull/SignupSuccessfull.jsx";
import { ProductPage } from "./pages/ProductPage/ProductPage.jsx";
import { SubmitBidding } from "./components/SubmitBidding/SubmitBidding.jsx";
import { MyBids } from "./pages/MyBIds/MyBids.jsx";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Singup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup-successfull" element={<SignupSuccessfull />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/submitBid/:id" element={<SubmitBidding/>}/>
          <Route path="/my-bids" element={<MyBids/>} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
