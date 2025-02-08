// components/Header.js
import React from "react";
import './Header.css';

function Header({ isLoggedIn, handleLogout }) {
    return (
        <header className="header">
            <h1>Umfragetool</h1>
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </header>
    );
}

export default Header;