// Front-End/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu/Menu";
import FoodDetails from "./pages/FoodDetails/FoodDetails";
import About from "./pages/About/About";
import Gallery from "./pages/Gallery/Gallery";
import Contact from "./pages/Contact/Contact";
import Reservations from "./pages/Reservations/Reservations";
import KulanSpecials from "./components/sections/KulanSpecials/KulanSpecials";
import Favorites from "./pages/Favorites/Favorites";
import CartPage from "./pages/OrderProcess/CartPage";
import Checkout from "./pages/OrderProcess/Checkout";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ProfilePage from "./pages/Profile/ProfilePage"; // Add this import
import OrderConfirmation from "./pages/OrderProcess/OrderConfirmation";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/specials" element={<KulanSpecials />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/order-online" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage />} />{" "}
            {/* Add this route */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}
            <Route
              path="/order-confirmation"
              element={<OrderConfirmation />}
            />{" "}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
