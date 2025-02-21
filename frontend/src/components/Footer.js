// components/Footer.js
import React from "react";
import './Footer.css';

function Footer(){
    return (
        <footer className="footer">
            <p className="footer-copyright">&copy; {new Date().getFullYear()}</p>
            <div className="footer-links">
                <a className="link_text"  href="https://liste-petrovic.at/impressum/">Impressum</a>
                <a className="link_text"  href="https://liste-petrovic.at/datenschutzerklaerung/">Datenschuterklärung</a>
            </div>
        </footer>
    );
}

export default Footer;
