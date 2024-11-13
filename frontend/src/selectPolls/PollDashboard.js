import React, { useState, useEffect } from 'react';
import SelectPolls from './SelectPolls';
import Results from '../results/Results';
import Voting from '../voting/Voting';

const PollDashboard = () => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [showResultsMode, setShowResults] = useState(true);
    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await fetch('http://localhost:3001/results/polls');
                const data = await response.json();
                setPolls(data); // Update the polls state
            } catch (error) {
                console.error('Error fetching polls:', error);
            }
        };
        fetchPolls();
    }, []);

    return (
        <div>
        <button onClick={() => setShowResults(!showResultsMode)}>
        {showResultsMode ? 'Show results' : 'Show poll'}
        </button>
        <SelectPolls polls={polls} setSelectedPoll={setSelectedPoll} />
        {showResultsMode ? (
            <Voting polls={polls} selectedPoll={selectedPoll} />
        ) : (
            <Results polls={polls} selectedPoll={selectedPoll} />
        )}
        </div>
    );
};

export default PollDashboard;
