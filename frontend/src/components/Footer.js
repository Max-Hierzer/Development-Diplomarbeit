// components/Footer.js
import React from "react";
import './Footer.css';

function Footer(){
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()}</p>
            <p>Impressum</p>
            <p>Datenschuterklärung</p>
        </footer>
    );
}

export default Footer;