import React from 'react';
import '../styles/dashboard.css';

const SelectPolls = ({ polls, setSelectedPoll }) => {
    return (
        <div>
        <h2>Select a Poll</h2>
        <select onChange={(e) => setSelectedPoll(e.target.value)}>
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
