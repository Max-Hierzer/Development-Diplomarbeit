import React, { useState, useEffect } from 'react';
import SelectPolls from './SelectPolls';
import Results from '../results/Results';
import Voting from '../voting/Voting';

const PollDashboard = ({ userId, userName }) => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Store selected answers for each question
    const [showResultsMode, setShowResults] = useState(false);

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

    // Update the selected answer for a specific question
    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answerId,
        }));
    };

    return (
        <div>
        <button onClick={() => setShowResults(!showResultsMode)}>
        {!showResultsMode ? 'Show results' : 'Show poll'}
        </button>

        <SelectPolls polls={polls} setSelectedPoll={setSelectedPoll} />
        {polls
            .filter((poll) => poll.id.toString() === selectedPoll)
            .map((poll) => (
                <div key={poll.id} className="poll">
                <h2>{poll.name}</h2>
                {poll.Questions && poll.Questions.map((question) => (
                    <div key={question.id} className="question">
                    <h3>{question.name}</h3>
                    {question.Answers && question.Answers.map((answer) => (
                        showResultsMode ? (
                            <Results answer={answer} question={question} />
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
            ))}

            {/* Submit button in PollDashboard */}
            {!showResultsMode && (
                <Voting
                selectedAnswers={selectedAnswers}
                userId={userId}
                submitVote={true} // Prop to indicate it's the submit action
                />
            )}
            </div>
    );
};

export default PollDashboard;
