import React, { useState, useEffect, useCallback } from 'react';

const PublicPolls = () => {
    const [showVoting, setShowVoting] = useState(false);
    const [poll, setPoll] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        setShowVoting(true);
    };

    useEffect(() => {
        const fetchPoll = async () => {
            const linkParam = new URLSearchParams(window.location.search);
            const pollId = linkParam.get('poll');
            if (pollId) {
                try {
                    const response = await fetch('http://localhost:3001/results/polls');
                    const data = await response.json();
                    console.log(typeof data[0].id);
                    console.log(typeof Number(pollId));
                    const poll_ = data.find((p) => p.id === Number(pollId));

                    console.log(poll_);

                    if (!poll_) {
                        setPoll(null); // No poll found for the given pollId
                        return;
                    }

                    const currentDateTime = new Date().toISOString();
                    if (
                        poll_.publish_date <= currentDateTime &&
                        poll_.end_date >= currentDateTime
                    ) {
                        setPoll(poll_); // Poll is valid and active
                    } else {
                        setPoll(null); // Poll is outside the valid date range
                    }
                } catch (error) {
                    console.error('Error fetching polls:', error);
                    setPoll(null); // Handle fetch error gracefully
                }
            }
        };

        fetchPoll(); // Invoke the async function
    }, []); // Empty dependency array ensures this runs once on mount

    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answerId,
        }));
    };

    return (
        <div className = "publicPoll">
        {
            !showVoting ? (
            <div className = "publicData">
            <h1>Please fill out your data</h1>
            <form className = "publicForm" onSubmit={handleSubmit}>
                <button type="submit">Submit</button>
            </form>
            </div>
            ) : (
            <div className = "publicVote">
                <h2>{poll.name}</h2>
                <h4 className='Beschreibung'>Beschreibung: </h4>
                <h5 className='Beschreibung'>{poll.description}</h5>
                <br></br>
                {poll.Questions &&
                    poll.Questions.map((question) => (
                        <div key={question.id} className="question">
                        <h3>{question.name}</h3>
                        {question.Answers &&
                            question.Answers.map((answer) => (
                                <div >
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
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
            )
        }
        </div>
    )
}

export default PublicPolls;