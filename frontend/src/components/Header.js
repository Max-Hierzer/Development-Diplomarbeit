// components/Header.js
import React from "react";
import './Header.css';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileNavigation from './navigation/MobileNavigation';

function Header({ isLoggedIn, handleLogout, setDisplayMode, setSelectedPoll, userRoleId }) {
    return (
        <header className="header">
            <div className="header-top">
                <h1 className="TitleName">Umfragetool</h1>
            </div>
            {isLoggedIn && <button className="LogoutButton" onClick={handleLogout}>Logout</button>}
            {isLoggedIn && <DesktopNavigation
                setDisplayMode={setDisplayMode}
                handleLogout={handleLogout}
                setSelectedPoll={setSelectedPoll}
                userRoleId={userRoleId} />
            }
            {isLoggedIn && <MobileNavigation
                setDisplayMode={setDisplayMode}
                handleLogout={handleLogout}
                setSelectedPoll={setSelectedPoll}
                userRoleId={userRoleId} />
            }
        </header>
    );
}

export default Header;
