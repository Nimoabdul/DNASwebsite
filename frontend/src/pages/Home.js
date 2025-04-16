import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "../pages/homeimage.jpg";
import "./Home.css"; 
const Home = () => {
  return (
    <div>
   

   {/* Hero Section */}
<section className="hero-section" style={{ backgroundImage: `url(${homeImage})` }}>
  <div className="overlay">
    <div className="hero-content">
      <h1 className="hero-title">DNAS NEW ARRIVALS</h1>
      <p className="hero-subtitle">Explore the latest trends now</p>
      <Link to="/products" className="shop-now-btn">Shop Now</Link>
    </div>
  </div>
</section>


   
    </div>
  );
};

export default Home;
