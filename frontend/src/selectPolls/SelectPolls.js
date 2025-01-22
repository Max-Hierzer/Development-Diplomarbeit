import React from 'react';
import '../styles/dashboard.css';

const SelectPolls = ({ polls, handleSetSelectedPoll, selectedPoll, mode }) => {
    const showHeading = () => {
        switch (mode) {
            case 1:
                return (<h1>Edit</h1>);
            case 2:
                return (<h1>Vote</h1>);
            case 3:
                return (<h1>Results</h1>);
            case 4:
                return (<h1>My Polls</h1>);
            default:
                return ("");
        }
    }

    return (
        <div>
        <br />
        {showHeading()}
        <br />
        <select
            value={selectedPoll ? selectedPoll.id : ""}
            onChange={(e) => handleSetSelectedPoll(e.target.value)}>
        <option value="">Select a poll</option>
        {polls.map((poll) => (
            <option key={poll.id} value={poll.id}>
            {poll.name}
            </option>
        ))}
        </select>
        </div>
    );
};

export default SelectPolls;
