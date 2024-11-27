import React, { useState } from 'react';
import '../styles/voting.css';

function Voting({ poll, question, answer, selectedAnswers, handleAnswerChange, userId, submitVote, resetAnswers, pollId }) {
    const [response, setResponse] = useState(null); // For showing the response message

    const handleVote = async (event) => {
        event.preventDefault(); // Prevent page refresh on form submit
        if (!(Object.keys(selectedAnswers).length === poll[0].Questions.length)) {
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

    return (
        <div >
            {!submitVote ? (
                <label className="answer" key={answer.id}>
                    <input
                        type="radio"
                        name={`question-${question.id}`} // Unique name for each question
                        value={answer.id}
                        checked={selectedAnswers[question.id] === answer.id}
                        onChange={() => handleAnswerChange(question.id, answer.id)} // Update selected answer for this question
                        key={answer.id}
                    />
                    <span>{answer.name}</span>
                </label>
            ) :
                (
                    <button
                        onClick={handleVote}
                        className='Submit_Vote'
                        title="Klicken um Abstimmung abzuschließen."
                        disabled={!pollId}
                    >
                        Submit Vote
                    </button>
                )}
                {response && <p>{response}</p>}
        </div>
    );
}

export default Voting;
