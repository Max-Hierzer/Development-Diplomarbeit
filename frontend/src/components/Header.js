// components/Header.js
import React from "react";
import './Header.css';
import Navigation from './Navigation';

function Header({ isLoggedIn, handleLogout, setDisplayMode, setSelectedPoll}) {
    return (
        <header className="header">
            <div className="header-top">
                <h1 className="TitleName">Umfragetool</h1>
                {isLoggedIn && <button className="LogoutButton" onClick={handleLogout}>Logout</button>}
            </div>
            {isLoggedIn && <Navigation setDisplayMode={setDisplayMode} setSelectedPoll={setSelectedPoll}/> }
        </header>
    );
}

export default Header;
