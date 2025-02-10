// components/Header.js
import React from "react";
import './Header.css';
import Navigation from './Navigation';

function Header({ isLoggedIn, handleLogout }) {
    return (
        <header className="header">
            <div className="header-top">
                <h1 className="TitleName">Umfragetool</h1>
                {isLoggedIn && <button className="LogoutButton" onClick={handleLogout}>Logout</button>}
            </div>
            {isLoggedIn && <Navigation /> }
        </header>
    );
}

export default Header;
