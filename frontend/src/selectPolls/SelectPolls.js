import React from 'react';
import '../styles/dashboard.css';

const SelectPolls = ({ polls, handleSetSelectedPoll, selectedPoll }) => {
    return (
        <div>
        <h2>Select a Poll</h2>
        <select onChange={(e) => handleSetSelectedPoll(e.target.value)}>
        {!selectedPoll.id && (<option defaultValue="">Select a poll</option>)}
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
