import React from 'react';
import '../styles/dashboard.css';

const SelectPolls = ({ polls, handleSetSelectedPoll, selectedPoll }) => {
    return (
        <div>
        <h2>Select a Poll</h2>
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
