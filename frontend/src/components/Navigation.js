import React, { useState } from "react";
import './Navigation.css';

function Navigation({ setDisplayMode }) {
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
                <button className="nav-button" onClick={() => setDisplayMode(5)}>Registrierung</button>
                <button className="nav-button" onClick={() => setDisplayMode(6)}>Erstellen</button>
                <button className="nav-button">Löschen</button>
                <button className="nav-button" onClick={() => setDisplayMode(1)}>Bearbeiten</button>
                <button className="nav-button" onClick={() => setDisplayMode(2)}>Abstimmen</button>
                <button className="nav-button" onClick={() => setDisplayMode(3)}>Ergebnisse</button>
                <button className="nav-button" onClick={() => setDisplayMode(4)}>Meine Umfragen</button>
            </nav>
        </div>
    );
}

export default Navigation;
