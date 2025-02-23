import React, { useState } from "react";
import {MdOutlineMenu} from 'react-icons/md'
import {MdClose} from 'react-icons/md';
import NavigationContent from './NavigationContent';
import './MobileNavigation.css';

function Navigation({ setDisplayMode, handleLogout, setSelectedPoll, userRoleId }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const roleId = parseInt(userRoleId);
    const hamburger = <MdOutlineMenu className="hamburger-menu" size="30px" color="black" onClick={() => setIsMenuOpen(!isMenuOpen)} />
    const close = <MdClose className="hamburger-menu" size="30px" color="black" onClick={() => setIsMenuOpen(!isMenuOpen)} />

    return (
        <nav className="mobile-nav">
            {isMenuOpen ? close : hamburger}
            {isMenuOpen && <NavigationContent
                mobile={true}
                setDisplayMode={setDisplayMode}
                handleLogout={handleLogout}
                setSelectedPoll={setSelectedPoll}
                roleId={roleId}
                setIsMenuOpen={setIsMenuOpen} />}
        </nav>
    );
}

export default Navigation;
