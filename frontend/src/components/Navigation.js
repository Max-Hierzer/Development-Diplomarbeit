import React, { useState } from "react";
import './Navigation.css';

function Navigation({ setDisplayMode, setSelectedPoll, userRoleId }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleModeChange = (mode) => {
        setDisplayMode(mode);
        setSelectedPoll(null);
    };
    const roleId = parseInt(userRoleId);

    const showContent = (roleId) => {
        switch (roleId) {
            case 1:
                return (
                    <>
                        <button className="nav-button" onClick={() => setDisplayMode(5)}>Registrierung</button>
                        <button className="nav-button" onClick={() => setDisplayMode(6)}>Erstellen</button>
                        <button className="nav-button" onClick={() => handleModeChange(1)}>Bearbeiten</button>
                        <button className="nav-button" onClick={() => handleModeChange(2)}>Abstimmen</button>
                        <button className="nav-button" onClick={() => handleModeChange(3)}>Ergebnisse</button>
                        <button className="nav-button" onClick={() => handleModeChange(4)}>Meine Umfragen</button>
                    </>
                );
            case 2:
                return (
                    <>
                        <button className="nav-button" onClick={() => setDisplayMode(6)}>Erstellen</button>
                        <button className="nav-button" onClick={() => handleModeChange(1)}>Bearbeiten</button>
                        <button className="nav-button" onClick={() => handleModeChange(2)}>Abstimmen</button>
                        <button className="nav-button" onClick={() => handleModeChange(3)}>Ergebnisse</button>
                        <button className="nav-button" onClick={() => handleModeChange(4)}>Meine Umfragen</button>
                    </>
                );

            case 3:
                return (
                    <>
                        <button className="nav-button" onClick={() => handleModeChange(2)}>Abstimmen</button>
                        <button className="nav-button" onClick={() => handleModeChange(3)}>Ergebnisse</button>
                    </>);
            default:
                return ('test');
        }
    }

    return (
        <div>
            <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
                {showContent(roleId)}
            </nav>
        </div>
    );
}

export default Navigation;
