import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../styles/groups.css';

const Groups = () => {
    const [createGroup, setCreateGroup] = useState(0);
    const [allGroups, setAllGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupUsers, setGroupUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUsersDel, setSelectedUsersDel] = useState([]);

    // Fetch all groups and all users
    useEffect(() => {
        handleFetchGroups();
        handleFetchAllUsers();
    }, []);

    // Fetch group users when a group is selected
    useEffect(() => {
        if (selectedGroup && selectedGroup.id) {
            handleFetchUsers(selectedGroup.id);
        }
    }, [selectedGroup]);


    // Fetch groups from the server
    const handleFetchGroups = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/groups`);
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/groups/users`);
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/groups/users/${groupId}`);
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
            const res = await fetch(`${process.env.REACT_APP_API_URL}/groups/edit`, {
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
            if (selectedUsers.length > 0) {
                const userIds = selectedUsers.map(user => user.value); // Get user IDs from selected options

                const addUsersResponse = await fetch(`${process.env.REACT_APP_API_URL}/groups/users`, {
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
            }
            if (selectedUsersDel.length > 0) {
                const userIdsDel = selectedUsersDel.map(user => user.value);
                const delUserResponse = await fetch(`${process.env.REACT_APP_API_URL}/groups/users`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        groupId: selectedGroup.id,
                        userIds: userIdsDel,
                    }),
                });

                if (delUserResponse.ok) {
                    console.log('User removed from group successfully');
                    setGroupUsers(prevUsers => prevUsers.filter(user => !userIdsDel.includes(user.id)));
                    setSelectedUsersDel([]);
                } else {
                console.error('Failed to remove user from group');
                }
            }
        } catch (error) {
            console.error('Error updating group: ', error);
        }
    };

    // Filter out users that are already in the selected group from the "add user" dropdown
    const availableUsers = allUsers.filter(user =>
    !groupUsers.some(groupUser => groupUser.id === user.id)
    );

    const handleCreateGroup = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/groups/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: selectedGroup?.name,
                    description: selectedGroup?.description,
                }),
            });

            if (response.ok) {
                const newGroup = await response.json();
                console.log('Group created successfully:', newGroup);
                setSelectedGroup(newGroup);

                // Add selected users to the new group
                if (selectedUsers.length > 0) {
                    const userIds = selectedUsers.map(user => user.value);
                    await fetch(`${process.env.REACT_APP_API_URL}/groups/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ groupId: newGroup.id, userIds }),
                    });

                    console.log('Users added successfully');
                }

                if (selectedUsersDel.length > 0) {
                    const userIds = selectedUsersDel.map(user => user.value);
                    await fetch(`${process.env.REACT_APP_API_URL}/groups/users`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            groupId: selectedGroup.id,
                            userIds: userIds
                        }),
                    });
                }

                setCreateGroup(2); // Show success message
                handleFetchGroups(); // Refresh groups
            } else {
                console.log('Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleExport = () => {
        if (!groupUsers || groupUsers.length === 0) {
            alert("No users to export!");
            return;
        }

        // Convert users to CSV format
        const csvContent = [
            ['ID', 'Name', 'Email'], // CSV header
            ...groupUsers.map(user => [user.id, user.name, user.email]) // User rows
        ]
        .map(row => row.join(','))
        .join('\n');

        // Create a Blob with CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        // Create an anchor tag to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedGroup?.name || 'group'}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Clean up the object URL
        window.URL.revokeObjectURL(url);
    };


    const handleDeleteGroup = async (event) => {
        event.preventDefault();
        if (!selectedGroup) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/groups/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    groupId: selectedGroup.id,
                }),
            });

            if (response.ok) {
                console.log("Group deleted successfully")
                setAllGroups((prevGroups) => prevGroups.filter(group => group.id !== selectedGroup.id));
                setSelectedGroup(null)
            } else {
                console.error('Failed to delete group');
            }
        } catch (error) {
            console.error('Error removing group from poll:', error);
        }
    }

        return (
            <div className="groups-container">
            {createGroup ? (
                <div className="group-details"> {/* Apply group-details class here */}
                <button onClick={() => {
                    setCreateGroup(0);
                    setSelectedGroup(null);
                    setSelectedUsers([]);
                }}>
                Gruppen Bearbeiten
                </button>

                <form onSubmit={handleCreateGroup}>
                    <h2>Gruppe erstellen</h2>
                    <label htmlFor="createName" className="hidden-label">Gruppenname</label>
                    <input
                        id="createName"
                        type="text"
                        placeholder="Gruppenname"
                        value={selectedGroup?.name || ''}
                        onChange={(e) => handleGroupChange('name', e.target.value)}
                    />
                    <label htmlFor="createDescription" className="hidden-label">Beschreibung</label>
                    <textarea
                        id="createDescription"
                        placeholder="Beschreibung"
                        rows={5}
                        cols={50}
                        style={{ resize: 'vertical' }}
                        className="description"
                        value={selectedGroup?.description || ''}
                        onChange={(e) => handleGroupChange('description', e.target.value)}
                    />

                    <h3>Füge Benutzer zur Gruppe hinzu</h3>
                    <Select
                        isMulti
                        value={selectedUsers}
                        options={allUsers.map(user => ({ value: user.id, label: user.name }))}
                        onChange={(selectedOptions) => setSelectedUsers(selectedOptions)}
                        placeholder="Suche nach Benutzern"
                    />
                    <button type="submit" className="create-button">Gruppe erstellen</button>
                </form>

                {createGroup === 2 && <p>Gruppe erfolgreich erstellt!</p>}
                </div>
            ) : (
                <>
                <button onClick={() => {
                    setCreateGroup(1);
                    setSelectedGroup({ name: '', description: '' });
                    setSelectedUsers([]);
                }}>
                Gruppen Erstellen
                </button>
                <div className="group-details">
                <h2>Wähle eine Gruppe</h2>
                <Select
                    className="select-group-single"
                    value={selectedGroup ? { value: selectedGroup.id, label: selectedGroup.name } : null}
                    options={allGroups.map(group => ({
                        value: group.id,
                        label: group.name
                    }))}
                    onChange={(selectedOptions) => {
                        const group = allGroups.find(g => g.id === selectedOptions.value);
                        setSelectedGroup(group);
                    }}
                    placeholder="Suche nach einer Gruppe"
                />

                {selectedGroup && (
                    <>
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

                    <h3>Füge Benutzer zur Gruppe hinzu</h3>
                    <Select
                        isMulti
                        value={selectedUsers}
                        options={availableUsers.map(user => ({
                            value: user.id,
                            label: user.name
                        }))}
                        onChange={(selectedOptions) => setSelectedUsers(selectedOptions)}
                        placeholder="Suche nach Benutzern"
                    />
                    <br />
                    <h3>Benutzer von Gruppe entfernen</h3>
                    <Select
                        isMulti
                        value={selectedUsersDel}
                        options={groupUsers.map(user => ({ value: user.id, label: user.name }))}
                        onChange={(selectedOptions) => setSelectedUsersDel(selectedOptions)}
                        placeholder="Suche nach Benutzern"
                    />

                    <button onClick={handleEditGroup}>Änderungen speichern</button>
                    <br />
                    <button onClick={handleExport}>Benutzer exportieren</button>
                    <br />
                    <button onClick={handleDeleteGroup}>Gruppe löschen</button>
                    </>
                )}
                </div>
                </>
            )}
            </div>
        );
    };

    export default Groups;
