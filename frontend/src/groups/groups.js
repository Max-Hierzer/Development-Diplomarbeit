import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../styles/groups.css';

const Groups = () => {
    const [createGroup, setCreateGroup] = useState(0);
    const [allGroups, setAllGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupUsers, setGroupUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]); // Store selected users temporarily

    // Fetch all groups and all users
    useEffect(() => {
        handleFetchGroups();
        handleFetchAllUsers();
    }, []);

    // Fetch group users when a group is selected
    useEffect(() => {
        if (selectedGroup) {
            handleFetchUsers(selectedGroup.id);
        }
    }, [selectedGroup]);

    // Fetch groups from the server
    const handleFetchGroups = async () => {
        try {
            const response = await fetch('http://localhost:3001/groups');
            if (response.ok) {
                const data = await response.json();
                setAllGroups(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch all users from the server
    const handleFetchAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/groups/users');
            if (response.ok) {
                const data = await response.json();
                setAllUsers(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch users in a specific group
    const handleFetchUsers = async (groupId) => {
        try {
            const response = await fetch(`http://localhost:3001/groups/users/${groupId}`);
            if (response.ok) {
                const data = await response.json();
                setGroupUsers(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Handle group selection from dropdown
    const handleSelectGroup = (event) => {
        const groupId = event.target.value;
        const group = allGroups.find(g => g.id === parseInt(groupId));
        if (group) {
            setSelectedGroup(group);
        }
    };

    // Handle changes to group properties (name, description)
    const handleGroupChange = (field, value) => {
        setSelectedGroup(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle creating or editing a group
    const handleEditGroup = async (event) => {
        event.preventDefault();
        try {
            // First, save changes to the group
            const res = await fetch(`http://localhost:3001/groups/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedGroup),
            });

            if (res.ok) {
                console.log('Group updated successfully');
            } else {
                const data = await res.json();
                console.log('Failed to update group:', data);
            }

            // Now, add the selected users to the group
            const userIds = selectedUsers.map(user => user.value); // Get user IDs from selected options

            const addUsersResponse = await fetch('http://localhost:3001/groups/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupId: selectedGroup.id,
                    userIds: userIds
                }),
            });

            if (addUsersResponse.ok) {
                console.log('Users added successfully');
                // Update the group users list with the newly added users
                setGroupUsers(prevUsers => [
                    ...prevUsers,
                    ...selectedUsers.map(user => ({
                        id: user.value,
                        name: user.label
                    }))
                ]);
                setSelectedUsers([]); // Clear the selected users after adding them
            } else {
                console.log('Failed to add users');
            }
        } catch (error) {
            console.error('Error updating group or adding users:', error);
        }
    };


    // Handle removing a user from the group
    const handleRemoveUserFromGroup = async (userId) => {
        if (!selectedGroup) return;

        try {
            const response = await fetch(`http://localhost:3001/groups/users/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupId: selectedGroup.id,
                    userId: userId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User removed from group successfully', data);

                // Update state to remove user from the list
                setGroupUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
            } else {
                console.error('Failed to remove user from group');
            }
        } catch (error) {
            console.error('Error removing user from group:', error);
        }
    };


    // Filter out users that are already in the selected group from the "add user" dropdown
    const availableUsers = allUsers.filter(user =>
    !groupUsers.some(groupUser => groupUser.id === user.id)
    );

    return (
        <div className="groups-container">
        {createGroup ? (
            <>
            <button onClick={() => setCreateGroup(0)}>Gruppen Bearbeiten</button>
            <form className="group-form">
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
                <div>
                <div className="group-details">
                <h3>Gruppenname</h3>
                <label htmlFor="editName" className="hidden-label">Gruppenname bearbeiten</label>
                <input
                id="editName"
                type="text"
                value={selectedGroup.name || ''}
                onChange={(e) => handleGroupChange('name', e.target.value)}
                />
                <br />
                <h3>Gruppen Beschreibung</h3>
                <label htmlFor="editDescription" className="hidden-label">Beschreibung bearbeiten</label>
                <textarea
                id="editDescription"
                rows={5}
                cols={50}
                style={{ resize: 'vertical' }}
                className="description"
                value={selectedGroup.description || ''}
                onChange={(e) => handleGroupChange('description', e.target.value)}
                />
                </div>

                <h3>Gruppen Benutzer</h3>
                {groupUsers.length > 0 ? (
                    <ul>
                    {groupUsers.map(user => (
                        <li key={user.id}>
                        {user.name}
                        <button
                        onClick={() => handleRemoveUserFromGroup(user.id)}
                        className="remove-button"
                        >
                        Remove
                        </button>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p>No users in this group yet.</p>
                )}

                <h3>Füge Benutzer zur Gruppe hinzu</h3>
                <Select
                isMulti
                value={selectedUsers} // Bind the selected users here
                options={availableUsers.map(user => ({
                    value: user.id,
                    label: user.name
                }))}
                onChange={(selectedOptions) => setSelectedUsers(selectedOptions)} // Update selected users
                placeholder="Suche nach Benutzern"
                />

                <button onClick={handleEditGroup}>Änderungen speichern</button>
                </div>
            )}
            </>
        )}
        </div>
    );
};

export default Groups;
