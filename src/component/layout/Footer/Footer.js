import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>Sneakers rental</h4>
        <p>Best Sneakers in the town</p>
        
      </div>

      <div className="midFooter">
        <h1>Sneakers Rental.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2023 &copy; suprim</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/suprim_bhusal/">Instagram</a>
        <a href="https://www.facebook.com/suprim.bhusal.5/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;