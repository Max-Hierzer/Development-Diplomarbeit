import React, { useState, useEffect, useCallback } from 'react';
import '../styles/dashboard.css';
import SelectPolls from './SelectPolls';
import Results from '../results/Results';
import Voting from '../voting/Voting';
import ImportanceScale from '../voting/ImportanceScale';
import DeletePoll from '../DeletePolls/DeletePoll';
import EditPolls from '../editPolls/editPolls';
import Register from '../usermanagment/Register';
import CreatePoll from '../createPolls/CreatePolls';
import MyPoll from '../myPolls/MyPolls'
import SHA256 from 'crypto-js/sha256';

const PollDashboard = ({ userId, userName, userRoleId }) => {
    const [polls, setPolls] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [displayMode, setDisplayMode] = useState(0); // 0: initial, 1: Edit, 2: Vote, 3: Results, 4: Registration
    const [showVotersMode, setShowVoters] = useState(true);
    const [response, setResponse] = useState(null);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [editPolls, setEditPolls] = useState([]);
    const [votePolls, setVotePolls] = useState([]);
    const [resultsPolls, setResultsPolls] = useState([]);
    const [userPolls, setUserPolls] = useState([]);
    const [maxId, setMaxId] = useState(null);

    const roleId = parseInt(userRoleId);

    const resetAnswers = () => {
        setSelectedAnswers({});
    };

    const handleVote = async () => {
        const current_datetime = new Date().toISOString();
        if (selectedPoll.end_date > current_datetime) {
            if (!(Object.keys(selectedAnswers).length === selectedPoll.Questions.length)) {
                setResponse('Please select all questions');
                return;
            }

            console.log("Submitting vote:", JSON.stringify({answers: selectedAnswers}, null, 2));

            try {
                const res = await fetch('http://localhost:3001/api/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        answers: selectedAnswers,
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
        }
        else {
            setResponse('Poll has already ended')
        }
    };

    const handleAnonymousVote = async () => {
        if (!(Object.keys(selectedAnswers).length === selectedPoll.Questions.length)) {
            alert('Please select all questions');
            return;
        }
        console.log("Submitting Anonymous Vote", JSON.stringify({answers: selectedAnswers}, null, 2));

        const current_datetime = new Date().toISOString();
        if (selectedPoll.end_date > current_datetime) {
            try {
                const res = await fetch('http://localhost:3001/api/vote/anonymous', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        answers: selectedAnswers,
                        pollId: selectedPoll.id,
                        userId: userId
                    }),
                });

                if (res.ok) {
                    const data = await res.json();
                    alert(data.message);
                } else {
                    const errorData = await res.json();
                    alert(errorData.message || "An error occurred while submitting the vote.");
                }
            } catch (error) {
                console.error('Error submitting vote:', error);
                alert("Something went wrong. Please try again.");
            }
        }
        else {
            alert('Poll has already ended')
        }
    };

    const fetchPolls = useCallback(async () => {
        try {
            const userId = parseInt(sessionStorage.getItem('userId'));
            const response = await fetch('http://localhost:3001/results/polls');
            const res = await fetch('http://localhost:3001/api/pollId');
            const data = await response.json();
            const maxIdValue = await res.json();

            setPolls(data);
            setMaxId(maxIdValue);
            if (selectedPoll?.id && !data.find((poll) => poll.id === selectedPoll.id)) {
                setSelectedPoll(null);
            }
            const current_datetime = new Date().toISOString();
            const edit = [];
            const vote = [];
            const results = [];
            const user = [];
            data.forEach((poll) => {
                if (poll.user_id === userId) {
                    user.push(poll);
                }
                if (poll.publish_date > current_datetime) edit.push(poll);
                else if (poll.publish_date <= current_datetime && poll.end_date >= current_datetime && poll.public === false) vote.push(poll);
                else if (poll.public === true && poll.end_date < current_datetime) results.push(poll);
                else results.push(poll);
            })
            setEditPolls(edit);
            setVotePolls(vote);
            setResultsPolls(results);
            setUserPolls(user);

        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    }, [])

    useEffect(() => {
        fetchPolls();
    }, [fetchPolls]);

    const handleSetSelectedPoll = (pollId) => {
        const selected = polls.find((poll) => poll.id.toString() === pollId);
        setSelectedPoll(selected || null);
        setIsAnonymous(selected.anonymous || null);
    };

    const handleAnswerChange = (questionId, answerId, isMultipleChoice = false, checked = false) => {
        setSelectedAnswers((prevAnswers) => {
            if (isMultipleChoice) {
                const currentAnswers = prevAnswers[questionId]?.answer || [];
                return {
                    ...prevAnswers,
                    [questionId]: {
                        answer: checked
                            ? [...currentAnswers, answerId] // Add answer
                            : currentAnswers.filter((id) => id !== answerId), // Remove answer
                        importance: prevAnswers[questionId]?.importance || null, // Preserve importance
                    },
                };
            } else {
                return {
                    ...prevAnswers,
                    [questionId]: {
                        answer: [answerId], // Update single-choice answer
                        importance: prevAnswers[questionId]?.importance || null, // Preserve importance
                    },
                };
            }
        });
    }; 
    
    const handleDisplayMode = async (displayM, polla) => {
        setDisplayMode(displayM);
        await fetchPolls();
        setSelectedPoll(null);
    };

    const handleImportanceChange = (questionId, importance) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: {
                ...prevAnswers[questionId],
                importance,
            },
        }));
    };


    useEffect(() => {
        const linkParam = new URLSearchParams(window.location.search);
        const hashed = linkParam.toString();
        const paddedVoteHash = hashed.padEnd(hashed.length + (4 - (hashed.length % 4)) % 4, '=');
        const unhashed = atob(paddedVoteHash);
        const params = new URLSearchParams(unhashed);
        const mode = params.get('mode');
        const pollId = params.get('poll');

        if (pollId && mode && displayMode === 0) {
            let selected = null;
            if (mode === 'vote') {
                selected = votePolls.find((poll) => poll.id.toString() === pollId.toString());
                if (selected) {
                    setSelectedPoll(selected);
                    setDisplayMode(2);
                }
            } else if (mode === 'results') {
                selected = resultsPolls.find((poll) => poll.id.toString() === pollId);
                if (selected) {
                    setSelectedPoll(selected);
                    setDisplayMode(3);
                }
            }
        }
    }, [votePolls, resultsPolls, displayMode]);


    const showVoters = () => setShowVoters(!showVotersMode);

    const showButton = () => {
        if (!selectedPoll) return null;
        switch (displayMode) {
            case 1:
                break;
            case 2:
                return (
                    <div>
                        <button onClick={isAnonymous === true ? handleAnonymousVote : handleVote}>
                            Submit Vote
                        </button>
                    </div>
                );
            case 3:
                if (selectedPoll.public || selectedPoll.anonymous) return (
                    <button onClick={handleExportPoll}>
                        Export Poll
                    </button>
                )
                else {
                    return (
                    <div>
                        <button onClick={showVoters}>
                            Show Voters
                        </button>
                    </div>
                
                );
            }
            case 4:
                return (
                    <div>
                        <button>
                            Poll links
                        </button>
                    </div>
                );
            default:
                return <p>Select an action to proceed.</p>;
        }
    }

    const showSelect = (displayMode) => {
        switch (displayMode) {
            case 1:
                return (<SelectPolls polls={editPolls} handleSetSelectedPoll={handleSetSelectedPoll} selectedPoll={selectedPoll} mode={displayMode} />)
            case 2:
                return (<SelectPolls polls={votePolls} handleSetSelectedPoll={handleSetSelectedPoll} selectedPoll={selectedPoll} mode={displayMode} />)
            case 3:
                return (<SelectPolls polls={resultsPolls} handleSetSelectedPoll={handleSetSelectedPoll} selectedPoll={selectedPoll} mode={displayMode} />)
            case 4:
                return (<SelectPolls polls={userPolls} handleSetSelectedPoll={handleSetSelectedPoll} selectedPoll={selectedPoll} mode={displayMode} />)
            default:
                return ('')
        }
    }

    const showContent = (roleId) => {
        switch (roleId) {
            case 1:
                return (
                    <>
                    <div className="button-section">
                    <div>
                    <button onClick={() => setDisplayMode(5)}>Registration</button>
                    <button onClick={() => setDisplayMode(6)}>Create Poll</button>
                    <DeletePoll selectedPoll={selectedPoll} refreshPolls={fetchPolls} setSelectedPoll={setSelectedPoll} />
                    </div>
                    <div>
                    <button onClick={() => handleDisplayMode(1, editPolls)}>Edit</button>
                    <button onClick={() => handleDisplayMode(2, votePolls)}>Vote</button>
                    <button onClick={() => handleDisplayMode(3, resultsPolls)}>Results</button>
                    <button onClick={() => handleDisplayMode(4, userPolls)}>My Polls</button>
                    </div>
                    </div>
                    </>
                );
            case 2:
                return (
                    <>
                    <div className="button-section">
                    <div>
                        <button onClick={() => setDisplayMode(6)}>Create Poll</button>
                        <DeletePoll selectedPoll={selectedPoll} refreshPolls={fetchPolls} setSelectedPoll={setSelectedPoll} />
                    </div>
                    <div>
                    <button onClick={() => handleDisplayMode(1, editPolls)}>Edit</button>
                    <button onClick={() => handleDisplayMode(2, votePolls)}>Vote</button>
                    <button onClick={() => handleDisplayMode(3, resultsPolls)}>Results</button>
                    <button onClick={() => handleDisplayMode(4, userPolls)}>My Polls</button>
                    </div>
                    </div>
                    </>
                );

            case 3:
                return (
                    <>
                    <div className="button-section">
                    <button onClick={() => handleDisplayMode(2, votePolls)}>Vote</button>
                    <button onClick={() => handleDisplayMode(3, resultsPolls)}>Results</button>
                    </div>
                    </>);
            default:
                return ('test');
        }
    }

    return (
        <div className="dashboard-container" style={{ minHeight: '400px',height: 'auto', overflow: 'visible' }}>
            {showContent(roleId)}
            {showSelect(displayMode)}
            <div className="poll-content">
            {displayMode === 1 && (
                <EditPolls selectedPoll={selectedPoll} refreshPolls={fetchPolls} />
            )}
            {displayMode === 2 && selectedPoll && (
                <>
                <h2>{selectedPoll.name}</h2>
                {selectedPoll.description && (
                    <div>
                    <h4 className='description-header'>Beschreibung: </h4>
                    <h5 className='description'>{selectedPoll.description}</h5>
                    </div>
                )}
                <br />
                {selectedPoll.Questions &&
                    selectedPoll.Questions.map((question) => (
                        <div key={question.id} className="question">
                        <h3 className="question-header">
                            <span className="question-text">{question.name}</span>
                            <span className="question-type">{question.QuestionType.name}</span>
                        </h3>
                        {question.Answers &&
                            question.Answers.map((answer) => (
                                <Voting
                                key={answer.id}
                                question={question}
                                answer={answer}
                                selectedAnswers={selectedAnswers}
                                handleAnswerChange={handleAnswerChange}
                                />
                            ))}

                        {question.QuestionType.name === "Weighted Choice" && (
                            <ImportanceScale
                                questionId={question.id}
                                onImportanceChange={handleImportanceChange}
                            />
                        )}
                        </div>
                    ))}
                    {showButton()}
                    </>
            )}
            {displayMode === 3 && selectedPoll && (
                <>
                <h2>{selectedPoll.name}</h2>
                {selectedPoll.description && (
                    <div>
                    <h4 className='description-header'>Beschreibung: </h4>
                    <h5 className='description'>{selectedPoll.description}</h5>
                    </div>
                )}
                <br />
                {selectedPoll.Questions &&
                    selectedPoll.Questions.map((question) => (
                        <div key={question.id} className="question">
                        <h3 className="question-header">
                            <span className="question-text">{question.name}</span>
                            <span className="question-type">{question.QuestionType.name}</span>
                        </h3>
                        {question.Answers &&
                            question.Answers.map((answer) => (
                                <Results
                                key={answer.id}
                                answer={answer}
                                question={question}
                                showVotersMode={showVotersMode}
                                />
                            ))}
                            </div>
                    ))}
                    {showButton()}
                    </>
            )}
            {displayMode === 4 && selectedPoll && (
                <MyPoll pollId={selectedPoll.id} pollName={selectedPoll.name} isPublic={selectedPoll.public} isAnonymous={selectedPoll.anonymous}/>
            )}
            {displayMode === 5 && (
                <Register />
            )}
            {displayMode === 6 && (
                <CreatePoll />
            )}
            {displayMode === 0 && (
                <p>Select an action to proceed.</p>
            )}
            {!selectedPoll && displayMode > 1 && displayMode < 5 && (
                <p>Please select a poll</p>
            )}
            </div>
        </div>

    );
};

export default PollDashboard;
