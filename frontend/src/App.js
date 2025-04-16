import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import ProductPage from "./pages/ProductPage";
import AllProducts from "./pages/AllProducts";
import TopsPage from "./pages/TopsPage";
import BottomsPage from "./pages/BottomsPage";
import ShoesPage from "./pages/ShoesPage";
import SearchResults from "./pages/SearchResults";
import AdminDashboard from './pages/AdminDashboard';
import EditProduct from './pages/EditPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProducts />} /> {/* ✅ Cleaned */}
            <Route path="/category/tops" element={<TopsPage />} />
            <Route path="/category/bottoms" element={<BottomsPage />} />
            <Route path="/category/shoes" element={<ShoesPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/edit/:id" element={<EditProduct />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
