import React, { useState, useEffect } from 'react';
import '../styles/groups.css';

const Groups = ({  }) => {
    const [createGroup, setCreateGroup] = useState(0);
    return (
        <div className="groups-container">
            {createGroup ? (
                <>
                <button onClick={() => setCreateGroup(0)}>Gruppen Bearbeiten</button>
                <h2>Gruppe Erstellen</h2>
                </>
                ) : (
                <>
                <button onClick={() => setCreateGroup(1)}>Gruppe Erstellen</button>
                <h2>Gruppen Bearbeiten</h2>
                </>
                )}
        </div>
    );
};

export default Groups;
