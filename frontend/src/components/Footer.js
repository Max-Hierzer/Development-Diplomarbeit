// components/Footer.js
import React from "react";
import './Footer.css';

function Footer(){
    return (
        <footer className="footer">
            <a>&copy; {new Date().getFullYear()}</a>
            <a className="link_text"  href="https://liste-petrovic.at/impressum/">Impressum</a>
            <a className="link_text"  href="https://liste-petrovic.at/datenschutzerklaerung/">Datenschuterklärung</a>
        </footer>
    );
}

export default Footer;