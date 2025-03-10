import React, { useState, useEffect } from 'react';
import '../styles/groups.css';

const Groups = ({  }) => {
    const [createGroup, setCreateGroup] = useState(0);
    const [allGroups, setAllGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupUsers, setGroupUsers] = useState([]);

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

    useEffect(() => {
        const handleFetchUsers = async () => {
            try {
                const response = await fetch(`http://localhost:3001/groups/users/${selectedGroup.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setGroupUsers(data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (selectedGroup) {
            handleFetchUsers();
        }
    }, [selectedGroup]);

    console.log(groupUsers)

    const handleSelectGroup = (event) => {
        const groupId = event.target.value;
        const group = allGroups.find(g => g.id === parseInt(groupId));
        if (group) {
            setSelectedGroup(group);
        }
    };


    const handleGroupChange = (field, value) => {
        setSelectedGroup(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const handleEditGroup = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch(`http://localhost:3001/groups/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedGroup),
            });
            const data = await res.json();

            if (res.ok) {
                console.log("Group updated successfully");
            } else {
                console.log("Failed to update group:", data);
            }
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };


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
            {selectedGroup ? (
                <div className="group-details">
                <h3>Gruppenname</h3>
                <label htmlFor="editName" className="hidden-label">Gruppenname bearbeiten</label>
                <input
                    id="editName"
                    type="text"
                    value={selectedGroup.name || ''} // fallback value in case it's undefined
                    onChange={(e) => handleGroupChange('name', e.target.value)}
                />
                <br/>
                <h3>Gruppen Beschreibung</h3>
                <label htmlFor="editDescription" className="hidden-label">Beschreibung bearbeiten</label>
                <textarea
                    id="editDescription"
                    rows={5}
                    cols={50}
                    style={{ resize: 'vertical' }}
                    className="description"
                    value={selectedGroup.description || ''} // fallback value in case it's undefined
                    onChange={(e) => handleGroupChange('description', e.target.value)}
                />
                <button onClick={(e) => handleEditGroup(e)}>Änderungen speichern</button>
                </div>
            ) : (
                <div>Select a group to edit.</div> // Handle case where no group is selected yet
            )}
            </>
            )}
        </div>
    );
};

export default Groups;
