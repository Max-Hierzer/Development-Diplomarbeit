import React, { useState } from "react";
import NavigationContent from './NavigationContent';
import './DesktopNavigation.css';

function Navigation({ setDisplayMode, setSelectedPoll, userRoleId }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const roleId = parseInt(userRoleId);


    return (
        <div>
            <nav className={`desktop-nav ${isMenuOpen ? 'open' : ''}`}>
                {<NavigationContent setDisplayMode={setDisplayMode} setSelectedPoll={setSelectedPoll} roleId={roleId} setIsMenuOpen={setIsMenuOpen} />}
            </nav>
        </div>
    );
}

export default Navigation;
