import React from 'react';
import '../styles/dashboard.css';

const SelectPolls = ({ polls, handleSetSelectedPoll, selectedPoll, mode }) => {
    const maxLength = 19;

    const shortenText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };


    const showHeading = () => {
        switch (mode) {
            case 1:
                return (<h1>Bearbeiten</h1>);
            case 2:
                return (<h1>Abstimmen</h1>);
            case 3:
                return (<h1>Ergebnisse</h1>);
            case 4:
                return (<h1>Meine Umfragen</h1>);
            default:
                return ("");
        }
    }

    return (
        <div className="select-content">
        <br />
        {showHeading()}
        <br />
        <select
            value={selectedPoll ? selectedPoll.id : ""}
            onChange={(e) => handleSetSelectedPoll(e.target.value)}
            className="select-poll">
        <option value="">Umfrage auswählen</option>
        {polls.map((poll) => (
            <option key={poll.id} value={poll.id}>
                {shortenText(poll.name, maxLength)}
            </option>
        ))}
        </select>
        </div>
    );
};

export default SelectPolls;
