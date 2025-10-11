import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Reservations from "./pages/Reservations";
import KulanSpecials from "./components/sections/KulanSpecials";
import Favorites from "./pages/Favorites"; // Add this import
import OrderOnline from "./pages/OrderOnline"; // Add this import
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/specials" element={<KulanSpecials />} />
          <Route path="/favorites" element={<Favorites />} />{" "}
          {/* Add this route */}
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/order-online" element={<OrderOnline />} />{" "}
          <Route path="/checkout" element={<Checkout />} />
          {/* Add this route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
