import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import SelectPolls from './SelectPolls';
import Results from '../results/Results';
import Voting from '../voting/Voting';
import DeletePoll from '../DeletePolls/DeletePoll';
import EditPolls from '../editPolls/editPolls';

const PollDashboard = ({ userId, userName }) => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResultsMode, setShowResults] = useState(false);
    const [showVotersMode, setShowVoters] = useState(true);
    const [isEditMode, setEditMode] = useState(false);

    console.log(selectedPoll);
    const fetchPolls = async () => {
        try {
            const response = await fetch('http://localhost:3001/results/polls');
            const data = await response.json();
            setPolls(data);
        } catch (error) {
            console.error('Error fetching polls:', error);
        }
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

    const resetAnswers = () => {
        setSelectedAnswers({});
    };

    const showVoters = () => setShowVoters(!showVotersMode);        // toggle how the results should be displayed

    return (
        <div>
            <button onClick={()=> setEditMode(!isEditMode)}>
            Edit Poll
            </button>
            <DeletePoll pollId={selectedPoll} refreshPolls={fetchPolls} />
            <button onClick={() => setShowResults(!showResultsMode)}>
                {!showResultsMode ? 'Show results' : 'Show poll'}
            </button>

            <SelectPolls polls={polls} setSelectedPoll={setSelectedPoll} />
            {!isEditMode ?
                polls
                .filter((poll) => poll.id.toString() === selectedPoll)
                .map((poll) => (
                    <div key={poll.id} className="poll">
                        <h2>{poll.name}</h2>
                        {poll.Questions && poll.Questions.map((question) => (
                            <div key={question.id} className="question">
                                <h3>{question.name}</h3>
                                {question.Answers && question.Answers.map((answer) => (
                                    showResultsMode ? (
                                        <Results answer={answer} question={question} showVotersMode={showVotersMode}/>
                                    ) : (
                                        <Voting
                                            question={question}
                                            answer={answer}
                                            selectedAnswers={selectedAnswers}
                                            handleAnswerChange={handleAnswerChange}
                                        />
                                    )
                                ))}

                            </div>
                        ))}
                    </div>
                )) : (
                <EditPolls selectedPoll={selectedPoll} polls={polls}/>
                )
            }
            { !isEditMode ?
                !showResultsMode ? (
                <Voting
                poll={polls.filter((poll) => poll.id.toString() === selectedPoll)}
                    selectedAnswers={selectedAnswers}
                    userId={userId}
                    submitVote={true}
                    resetAnswers = {resetAnswers}
                    pollId = {selectedPoll}
                />
            ) : (
                <button onClick={showVoters}>
                {showVotersMode ? 'Show voters' : 'Show count'}
                </button>
                )
            : ''
            }
        </div>
    );
};

export default PollDashboard;
