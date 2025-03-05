import React from "react";

function NavigationContent({ mobile, setDisplayMode, handleLogout, setSelectedPoll, roleId, setIsMenuOpen }) {

    const handleModeChange = (mode) => {
        setDisplayMode(mode);
        setSelectedPoll(null);
        setIsMenuOpen(false);
    };

    switch (roleId) {
        case 1:
            return (
                <nav className="navlinks">
                    <ul>
                        <li>
                            <a onClick={() => handleModeChange(5)}>Registrierung</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(6)}>Erstellen</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(1)}>Bearbeiten</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(2)}>Abstimmen</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(3)}>Ergebnisse</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(4)}>Meine Umfragen</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(7)}>Gruppen</a>
                        </li>
                        {mobile &&
                            <li>
                                <a onClick={handleLogout}>Logout</a>
                            </li>
                        }
                    </ul>
                </nav>
            );
        case 2:
            return (
                <nav className="navlinks">
                    <ul>
                        <li>
                            <a onClick={() => handleModeChange(6)}>Erstellen</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(1)}>Bearbeiten</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(2)}>Abstimmen</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(3)}>Ergebnisse</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(4)}>Meine Umfragen</a>
                        </li>
                        {mobile && <li>
                                <a onClick={handleLogout}>Logout</a>
                            </li>
                        }
                    </ul>
                </nav>
            );

        case 3:
            return (
                <nav className="navlinks">
                    <ul>
                        <li>
                            <a onClick={() => handleModeChange(2)}>Abstimmen</a>
                        </li>
                        <li>
                            <a onClick={() => handleModeChange(3)}>Ergebnisse</a>
                        </li>
                        {mobile && <li>
                                <a onClick={handleLogout}>Logout</a>
                            </li>
                        }
                    </ul>
                </nav>
            );
        default:
            return ('test');
    }
};

export default NavigationContent;
