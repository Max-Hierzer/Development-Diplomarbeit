import React, { useState, useEffect } from 'react';

function Voting({ question, answer, selectedAnswers, handleAnswerChange, userId, submitVote }) {
    const [response, setResponse] = useState(null); // For showing the response message

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
            if (res.ok) {
                setResponse(`User ID: ${userId} voted successfully.`);
            } else {
                setResponse(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
            setResponse('Error submitting vote');
        }
    };

    return (
        <div className="answer">
            {!submitVote ? (
            <label>
            <input
                type="radio"
                name={`question-${question.id}`} // Unique name for each question
                value={answer.id}
                checked={selectedAnswers[question.id] === answer.id}
                onChange={() => handleAnswerChange(question.id, answer.id)} // Update selected answer for this question
            />
            <span>{answer.name}</span>
            </label>
            ) :
            (
            <button onClick={handleVote}>Submit Vote</button>
            )}
            {response && <p>{response}</p>}
        </div>
    );
}

export default Voting;
