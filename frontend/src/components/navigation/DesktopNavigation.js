import React from "react";
import NavigationContent from './NavigationContent';
import './DesktopNavigation.css';

function Navigation({ setDisplayMode, handleLogout, setSelectedPoll, userRoleId }) {
    const roleId = parseInt(userRoleId);


    return (
        <nav className="desktop-nav">
            {<NavigationContent
                mobile={false}
                setDisplayMode={setDisplayMode}
                handleLogout={handleLogout}
                setSelectedPoll={setSelectedPoll}
                roleId={roleId} />}
        </nav>
    );
}

export default Navigation;
