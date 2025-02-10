import React, { useState } from "react";
import './Navigation.css';

function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
                <button className="nav-button">Registrierung</button>
                <button className="nav-button">Erstellen</button>
                <button className="nav-button">Löschen</button>
                <button className="nav-button">Bearbeiten</button>
                <button className="nav-button">Abstimmen</button>
                <button className="nav-button">Ergebnisse</button>
                <button className="nav-button">Meine Umfragen</button>
            </nav>
        </div>
    );
}

export default Navigation;
