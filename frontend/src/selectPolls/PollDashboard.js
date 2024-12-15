import React, { useState, useEffect, useCallback } from 'react';
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
    const [editPolls, setEditPolls] = useState([]);
    const [votePolls, setVotePolls] = useState([]);
    const [resultsPolls, setResultsPolls] = useState([]);

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

    const fetchPolls = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3001/results/polls');
            const data = await response.json();
            setPolls(data);
            if (selectedPoll?.id && !data.find((poll) => poll.id === selectedPoll.id)) {
            setSelectedPoll(null); // Clear selectedPoll if it no longer exists
            }
            const current_datetime = new Date().toLocaleString();
            data.forEach((poll) => {
                 if (poll.publish_date > current_datetime) editPolls.push(poll);
                 else if (poll.publish_date <= current_datetime && poll.end_date >= current_datetime) votePolls.push(poll);
                 else resultsPolls.push(poll);
            })
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    }, [])

    useEffect(() => {
        fetchPolls(); // Triggered once when the component mounts
    }, [fetchPolls]);

    const handleSetSelectedPoll = (pollId) => {
            const selected = polls.find((poll) => poll.id.toString() === pollId);
            setSelectedPoll(selected || null);
    };

    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answerId,
        }));
    };

    const handleDisplayMode = async (displayM) => {
        setDisplayMode(displayM);
        await fetchPolls();
        if (selectedPoll?.id) {
            const updatedPoll = polls.find((poll) => poll.id === selectedPoll.id);
            setSelectedPoll(updatedPoll || null);
        }
    }

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

    const  showSelect = (displayMode) => {
        switch (displayMode) {
            case 1:
                return (<SelectPolls polls={editPolls} handleSetSelectedPoll={handleSetSelectedPoll} selectedPoll={selectedPoll} />)
            case 2:
                return (<SelectPolls polls={votePolls} handleSetSelectedPoll={handleSetSelectedPoll} selectedPoll={selectedPoll} />)
            case 3:
                return (<SelectPolls polls={resultsPolls} handleSetSelectedPoll={handleSetSelectedPoll} selectedPoll={selectedPoll} />)
            default:
                return ('')
        }
    }
    return (
        <div className="dashboard-container">
        {/* Poll Selection */}
        {showSelect(displayMode)}


        {/* Control Buttons */}
        <div className="button-section">
        <button onClick={() => handleDisplayMode(1)}>Edit</button>
        <button onClick={() => handleDisplayMode(2)}>Vote</button>
        <button onClick={() => handleDisplayMode(3)}>Results</button>
        <DeletePoll selectedPoll={selectedPoll} refreshPolls={fetchPolls} setSelectedPoll={setSelectedPoll} />
        </div>

        {/* Render Poll Content */}
        <div className="poll-content">
        {/* Your existing rendering logic */}
        {displayMode !== 1 ? (
            selectedPoll ? (
                <>
                <h2>{selectedPoll.name}</h2>
                {selectedPoll.Questions &&
                    selectedPoll.Questions.map((question) => (
                        <div key={question.id} className="question">
                        <h3>{question.name}</h3>
                        {question.Answers &&
                            question.Answers.map((answer) => {
                                switch (displayMode) {
                                    case 2:
                                        return (
                                            <Voting
                                            key={answer.id}
                                            question={question}
                                            answer={answer}
                                            selectedAnswers={selectedAnswers}
                                            handleAnswerChange={handleAnswerChange}
                                            />
                                        );
                                    case 3:
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
                                            <div className="answer">
                                            <h4>{answer.name}</h4>
                                            </div>
                                        );
                                }
                            })}
                            </div>
                    ))}
                    { showButton() }
                    </>
            ) : (
                <p>Please select a poll</p>
            )
        ) : (
            <EditPolls selectedPoll={selectedPoll} refreshPolls={fetchPolls} />
        )}
        </div>

        {/* Response Message */}
        <div className="response-message">
        {response && <p>{response}</p>}
        </div>
        </div>

    );
};

export default PollDashboard;
