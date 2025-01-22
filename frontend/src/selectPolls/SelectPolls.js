import React from 'react';
import '../styles/dashboard.css';

const SelectPolls = ({ polls, handleSetSelectedPoll, selectedPoll, mode }) => {
    const showHeading = () => {
        switch (mode) {
            case 1:
                return (<h2>Edit</h2>);
            case 2:
                return (<h2>Vote</h2>);
            case 3:
                return (<h2>Results</h2>);
            case 4:
                return (<h2>My Polls</h2>);
            default:
                return ("");
        }
    }

    return (
        <div>
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
