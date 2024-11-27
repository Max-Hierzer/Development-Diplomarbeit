import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import SelectPolls from './SelectPolls';
import Results from '../results/Results';
import Voting from '../voting/Voting';
import DeletePoll from '../DeletePolls/DeletePoll';
import EditPolls from '../editPolls/editPolls';

const PollDashboard = ({ userId, userName }) => {
    const [polls, setPolls] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [displayMode, setDisplayMode] = useState(0)
    const [showVotersMode, setShowVoters] = useState(true);
    const [response, setResponse] = useState(null); // For showing the response message
    const [selectedPoll, setSelectedPoll] = useState({});

    const resetAnswers = () => {
        setSelectedAnswers({});
    };

    const handleVote = async () => {
        if (!(Object.keys(selectedAnswers).length === selectedPoll.Questions.length)) {
            setResponse('Please select all questions');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,          // The ID of the user casting the vote
                    answers: selectedAnswers, // Object containing questionId and answerId pairs
                }),
            });

            if (res.ok) {
                setResponse(`User ID: ${userId} voted successfully.`);
                resetAnswers();
            } else {
                alert(`User has already voted.`);
                resetAnswers();
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
            setResponse('Error submitting vote');
        }
    };

    const fetchPolls = async () => {
        try {
            const response = await fetch('http://localhost:3001/results/polls');
            const data = await response.json();
            setPolls(data);
            if (selectedPoll?.id && !data.find((poll) => poll.id === selectedPoll.id)) {
            setSelectedPoll(null); // Clear selectedPoll if it no longer exists
        }
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    };

    const handleSetSelectedPoll = (pollId) => {
            const selected = polls.find((poll) => poll.id.toString() === pollId);
            setSelectedPoll(selected || null);
    };

    useEffect(() => {
        fetchPolls();
    }, []);

    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answerId,
        }));
    };



    const showVoters = () => setShowVoters(!showVotersMode);        // toggle how the results should be displayed

    const showButton = () => {
        if (!selectedPoll) return null;
        switch (displayMode) {
            case 1:
                break;
            case 2: // Voting Mode
                return (
                    <div>
                    <button onClick={handleVote}>
                    Submit Vote
                    </button>
                    </div>
                );
            case 3: // Results Mode
                return (
                    <div>
                    <button onClick={showVoters}>
                    Show Voters
                    </button>
                    </div>
                );
            default: // Default Case
                return <p>Select an action to proceed.</p>;
        }
    }
    console.log(selectedPoll,  displayMode)
    return (
        <div>
        {/* Poll Selection */}
        <SelectPolls polls={polls} handleSetSelectedPoll={handleSetSelectedPoll} selectedPoll={selectedPoll}/>

        {/* Control Buttons */}
        <button onClick={() => setDisplayMode(1)}>Edit</button>
        <button onClick={() => setDisplayMode(2)}>Vote</button>
        <button onClick={() => setDisplayMode(3)}>Results</button>
        <DeletePoll selectedPoll={selectedPoll} refreshPolls={fetchPolls} setSelectedPoll={setSelectedPoll}/>

        {/* Render Poll Content */}
        <div key={selectedPoll.id} className="poll">
        {displayMode !== 1 &&

        selectedPoll ? (
            <>
        <h2>{selectedPoll.name}</h2>
        {selectedPoll.Questions &&
            selectedPoll.Questions.map((question) => (
                <div key={question.id} className="question">
                <h3>{question.name}</h3>
                    {question.Answers &&
                        question.Answers.map((answer) => {
                        // Render based on displayMode
                        switch (displayMode) {
                            case 2: // Voting mode
                                return (
                                    <Voting
                                    key={answer.id}
                                    question={question}
                                    answer={answer}
                                    selectedAnswers={selectedAnswers}
                                    handleAnswerChange={handleAnswerChange}
                                    />
                                );
                            case 3: // Results mode
                                return (
                                    <Results
                                    key={answer.id}
                                    answer={answer}
                                    question={question}
                                    showVotersMode={showVotersMode}
                                    />
                                );
                            default:
                                return (
                                <div className="Answer">
                                    <h4>{answer.name}</h4>
                                </div>
                                )
                        }}
                        )}
                </div>
            ))}
            {displayMode === 1 && <EditPolls selectedPoll={selectedPoll} />}
            </>
            ) : null}
            </div>
            <div className="button-section">
        {selectedPoll ? (
            <>
        {selectedPoll.id ? showButton() : (<p>Please select a poll</p>)}
        <p>{response}</p>
            </>
        ) : null}
        </div>
    </div>
    );
};

export default PollDashboard;
