import React, { useState, useEffect } from 'react';
import '../styles/groups.css';

const Groups = ({  }) => {
    const [createGroup, setCreateGroup] = useState(0);
    const [groups, setGroups] = useState([]);

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
                console.log(data);
                setGroups(data);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    console.log(groups)

    return (
        <div className="groups-container">
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
                rows={5} // Adjust the number of rows for the desired height
                cols={50} // Adjust the number of columns for the desired width
                style={{ resize: 'vertical' }} // Optional: Allow resizing vertically only
                className="description"
                />
                <button type="submit" className="create-button">Gruppe erstellen</button>
            </form>
        </div>
    );
};

export default Groups;
