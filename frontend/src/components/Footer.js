// components/Footer.js
import React from "react";
import './Footer.css';

function Footer(){
    return (
        <footer className="footer">
            <a>&copy; {new Date().getFullYear()}</a>
            <a>Impressum</a>
            <a>Datenschuterklärung</a>
        </footer>
    );
}

export default Footer;