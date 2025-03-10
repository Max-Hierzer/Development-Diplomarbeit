import React, { useState, useEffect } from 'react';
import '../styles/groups.css';

const Groups = ({  }) => {
    const [createGroup, setCreateGroup] = useState(0);
    const [allGroups, setAllGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        handleFetchGroups();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("created Poll");
    }


    const handleFetchGroups = async () => {
        try {
            const response = await fetch(`http://localhost:3001/groups`);
            if (response.ok) {
                const data = await response.json();
                setAllGroups(data);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleSelectGroup = (event) => {
        const groupId = event.target.value;
        const group = allGroups.find(g => g.id === parseInt(groupId));
        setSelectedGroup(group);
    }

    return (
        <div className="groups-container">
            {createGroup ? (
            <>
            <button onClick={() => setCreateGroup(0)}>Gruppen Bearbeiten</button>
            <form onSubmit={handleSubmit} className="group-form">
                <h1>Gruppe erstellen</h1>
                <label htmlFor="name" className="hidden-label">Gruppenname</label>
                <input
                id="name"
                type="text"
                placeholder={`Name`}
                />
                <br />
                <label htmlFor="beschreibung" className="hidden-label">Beschreibung</label>
                <textarea
                id="beschreibung"
                placeholder="Beschreibung"
                rows={5}
                cols={50}
                style={{ resize: 'vertical' }}
                className="description"
                />
                <button type="submit" className="create-button">Gruppe erstellen</button>
            </form>
            </>
            ) : (
            <>
            <button onClick={() => setCreateGroup(1)}>Gruppen Erstellen</button>
            <h2>Wähle eine Gruppe</h2>
            <select onChange={handleSelectGroup} defaultValue="">
            <option value="" disabled>Gruppe auswählen</option>
            {allGroups.map(group => (
                <option key={group.id} value={group.id}>
                {group.name}
                </option>
            ))}
            </select>
            {selectedGroup && (
                <div className="group-details">
                <h3>{selectedGroup.name}</h3>
                <p>{selectedGroup.description}</p>
                </div>
            )}
            </>
            )}
        </div>
    );
};

export default Groups;
