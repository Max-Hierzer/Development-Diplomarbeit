import React, { useState } from 'react';
import './Voting.css';

function Voting({ userId, userName, polls, selectedPoll }) {
    const [selectedAnswers, setSelectedAnswers] = useState({}); // Store answers for each question
    const [response, setResponse] = useState(null); // To show success/error message

    const handleVote = async (event) => {
        event.preventDefault(); // Prevent page refresh on form submit

        if (Object.keys(selectedAnswers).length === 0) {
            setResponse('Please select an answer for each question before voting');
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

            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setResponse(`User ${userName} (ID: ${userId}) voted successfully.`);
            } else {
                setResponse(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
            setResponse('Error submitting vote');
        }
    };

    // Update the selected answer for a specific question
    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answerId,
        }));
    };

    console.log(selectedAnswers)

    return (
        <div className="Voting">
        <form onSubmit={handleVote}>
        {polls
            .filter((poll) => poll.id.toString() === selectedPoll)
            .map((poll) => (
                <div key={poll.id} className="poll">
                <h1>Vote on {poll.name}</h1>
                {poll.Questions && poll.Questions.map((question) => (
                    <div key={question.id} className="question">
                    <h3>{question.name}</h3>
                    {question.Answers && question.Answers.map((answer) => (
                        <div key={answer.id} className="answer">
                        <label>
                        <input
                        type="radio"
                        name={`question-${question.id}`} // Unique name per question
                        value={answer.id}
                        checked={selectedAnswers[question.id] === answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)}
                        />
                        {answer.name}
                        </label>
                        <br />
                        </div>
                    ))}
                    </div>
                ))}
                </div>
            ))}
            <button type="submit">Submit Vote</button>
            </form>

            {response && <p>{response}</p>} {/* Show success/error message */}
            </div>
    );
}

export default Voting;
