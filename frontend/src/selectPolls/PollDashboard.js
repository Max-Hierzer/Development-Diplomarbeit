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
import Groups from '../groups/groups';
import MyPoll from '../myPolls/MyPolls'
import SHA256 from 'crypto-js/sha256';
import Cookies from 'js-cookie';

const PollDashboard = ({ userId, userName, userRoleId, setDisplayMode, displayMode, setSelectedPoll, selectedPoll }) => {
    const [polls, setPolls] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showVotersMode, setShowVoters] = useState(true);
    const [response, setResponse] = useState(null);
    const [editPolls, setEditPolls] = useState([]);
    const [votePolls, setVotePolls] = useState([]);
    const [resultsPolls, setResultsPolls] = useState([]);
    const [userPolls, setUserPolls] = useState([]);
    const [isPublic, setIsPublic] = useState(null);
    const [isAnonymous, setIsAnonymous] = useState(selectedPoll?.anonymous || null);
    const [maxIdValue, setMaxId] = useState(null)
    const roleId = parseInt(userRoleId);
    const [voteSubmitted, setVoteSubmitted] = useState(false);

    const resetAnswers = () => {
        setSelectedAnswers({});
    };


    const handleExportPoll = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/export/${selectedPoll.id}`, { method: 'GET' });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedPoll.name}_poll.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.log(response)
                alert('Error exporting poll');
            }
        } catch (error) {
            console.error('Error exporting poll:', error);
            alert('Error exporting poll');
        }
    };

    const handleExportPublicQuestions = async () => {
        try {
            const response = await fetch(`http://localhost:3001/public/export/${selectedPoll.id}`, { method: 'GET' });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedPoll.name}_demografische_daten.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.log(response)
                alert('Error exporting poll');
            }
        } catch (error) {
            console.error('Error exporting poll:', error);
            alert('Error exporting poll');
        }
    };

    const handleVote = async () => {
        const current_datetime = new Date().toISOString();
        if (selectedPoll.end_date > current_datetime) {
            if (!(Object.keys(selectedAnswers).length === selectedPoll.Questions.length)) {
                setResponse('Please select all questions');
                return;
            }
            console.log('HandleVote');
            console.log("Submitting vote:", JSON.stringify({ answers: selectedAnswers }, null, 2));

            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/vote`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        pollId: selectedPoll.id,
                        answers: selectedAnswers,
                    }),
                });

                if (res.ok) {
                    setResponse(`User ID: ${userId} voted successfully.`);
                    resetAnswers();
                    setVoteSubmitted(true);
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
        console.log("Submitting Anonymous Vote", JSON.stringify({ answers: selectedAnswers }, null, 2));

        console.log('AnonymousVote');

        const current_datetime = new Date().toISOString();
        if (selectedPoll.end_date > current_datetime) {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/vote/anonymous`, {
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
                    setVoteSubmitted(true);
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/poll/user/${userId}`);
            const data = await response.json();
            console.log(data)
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

            console.log("User POll: ", user);
            setEditPolls(edit);
            setVotePolls(vote);
            setResultsPolls(results);
            setUserPolls(user);

        } catch (error) {
            console.error('Error fetching polls:', error);
        }
    }, [isPublic])

    useEffect(() => {
        fetchPolls();
    }, [fetchPolls, displayMode]);

    const handleSetSelectedPoll = (pollId) => {
        fetchPolls();
        const selected = polls.find((poll) => poll.id.toString() === pollId);
        setSelectedPoll(selected || null);
        setIsAnonymous(selected?.anonymous || null);

        if (selected) {
            handleCheckUserVote(selected.id, userId); 
        }
    };

    const handleCheckUserVote = useCallback(async (pollId, userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hasVoted/${userId}/${pollId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch vote status');
            }
            const data = await response.json();
            setVoteSubmitted(data.hasVoted);
            return data.hasVoted;
    
        } catch (error) {
            console.error('Error checking user vote:', error);
            setVoteSubmitted(false); 
            return false;
        }
    }, []);
    

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
        const linkParam = window.location.search.substring(1);
        if (linkParam) {
            const unhashed = atob(decodeURIComponent(linkParam));
            const params = new URLSearchParams(unhashed);
            const mode = params.get('mode');
            const pollId = params.get('poll');
            const anonymous = params.get('anonymous');
            if (pollId && mode && displayMode === 0) {
                let selected = null;
                if (mode === 'vote') {
                    selected = votePolls.find((poll) => poll.id.toString() === pollId.toString());
                    if (selected) {
                        setSelectedPoll(selected);
                        setDisplayMode(2);
                        setIsAnonymous(selected?.anonymous);
                        setIsPublic(selected?.public);
                    }
                } else if (mode === 'results') {
                    selected = resultsPolls.find((poll) => poll.id.toString() === pollId);
                    if (selected) {
                        setSelectedPoll(selected);
                        setDisplayMode(3);
                        setIsAnonymous(selected?.anonymous);
                        setIsPublic(selected?.public);
                    }
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
                        {!voteSubmitted && (
                            <button
                                className="vote-button"
                                onClick={isAnonymous === true ? handleAnonymousVote : handleVote}
                                title={'Klicken Sie hier um die Umfrage abzuschließen.'}
                            >Umfrage abschließen
                            </button>
                        )}

                        {voteSubmitted && (
                            <><button
                                className={'disabled-button'}
                                title={'Auf diese Umfrage haben Sie bereits abgestimmt.'} // Tooltip-Nachricht hier
                            >
                                Umfrage abschließen
                            </button><p className="success-message">
                                    Danke für Ihre Teilnahme an dieser Umfrage.<br />
                                </p></>
                        )}
                    </div>
                );
            case 3:
                if (selectedPoll.anonymous) return (
                    <>
                    <button className="export-button" onClick={handleExportPoll}>
                        Export Poll
                    </button>
                    <div style={{ marginBottom: '10px' }}></div>
                    {selectedPoll.public && (
                        <button className="export-button" onClick={handleExportPublicQuestions}>
                        Demografische Daten exportieren
                        </button>
                    )}
                    </>
                );
                else {
                    return (
                        <div>
                            <button className="show-voters-button" onClick={showVoters}>
                                Show Voters
                            </button>
                            <button className="export-button" onClick={handleExportPoll}>
                                Export Poll
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
            case 7: return (<h1>Gruppen</h1>)
            default:
                return ('')
        }
    }

    /*const showContent = (roleId) => {
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
    }*/

    return (
        <div className="dashboard-container">
            {/*showContent(roleId)*/}
            {showSelect(displayMode)}
            <div className="poll-content">
                {displayMode === 1 && selectedPoll && (
                    <EditPolls
                        selectedPoll={selectedPoll}
                        refreshPolls={fetchPolls}
                        publicQ={(selectedPoll.publicPollQuestions).map((publicPoll) => ({
                            id: publicPoll.PublicQuestion.id,
                            name: publicPoll.PublicQuestion.name,
                            typeId: publicPoll.PublicQuestion.typeId,
                            questionType: publicPoll.PublicQuestion.QuestionType.name, // e.g., 'Single Choice'
                            PublicAnswers: publicPoll.PublicQuestion.PublicAnswers.map((answer) => ({
                                id: answer.id,
                                name: answer.name,
                            }))
                        }))}
                    />
                )}
                {displayMode === 2 && selectedPoll && (
                    <>
                        <Voting
                            selectedPoll={selectedPoll}
                            selectedAnswers={selectedAnswers}
                            handleAnswerChange={handleAnswerChange}
                            handleImportanceChange={handleImportanceChange}
                        />
                        {showButton()}
                    </>
                )}
                {displayMode === 3 && selectedPoll && (
                    <>
                        <Results
                            poll={selectedPoll}
                            showVotersMode={showVotersMode}
                        />
                        {showButton()}
                    </>
                )}
                {displayMode === 4 && selectedPoll && (
                    <MyPoll
                        poll={selectedPoll}
                        refreshPolls={fetchPolls}
                        setSelectedPoll={setSelectedPoll}
                    />
                )}
                {displayMode === 5 && (
                    <Register />
                )}
                {displayMode === 6 && (
                    <CreatePoll />
                )}
                {displayMode === 7 && (
                    <Groups />
                )}
                {displayMode === 0 && (
                    <p>Wähle eine Aktion um fortzufahren</p>
                )}
                {!selectedPoll && displayMode > 0 && displayMode < 5 && (
                    <p>Bitte wählen sie eine Umfrage</p>
                )}
            </div>
        </div>

    );
};

export default PollDashboard;
