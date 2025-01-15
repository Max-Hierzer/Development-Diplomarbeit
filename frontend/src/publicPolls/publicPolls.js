import React, { useState, useEffect } from 'react';
import './publicPolls.css';

const PublicPolls = () => {
    const [showVoting, setShowVoting] = useState(false);
    const [poll, setPoll] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [job, setJob] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);

        // Validate form fields
        const newFormErrors = {};
        if (!gender) {
            newFormErrors.gender = " *";
        }
        if (!age) {
            newFormErrors.age = "*";
        }
        if (!job) {
            newFormErrors.job = "*";
        }

        setFormErrors(newFormErrors);

        // Check if there are any errors
        if (Object.keys(newFormErrors).length === 0) {
            setShowVoting(true);
        }
    };

    useEffect(() => {
        const fetchPoll = async () => {
            const linkParam = new URLSearchParams(window.location.search);
            const pollId = linkParam.get('poll');
            if (pollId) {
                try {
                    const response = await fetch('http://localhost:3001/results/polls');
                    const data = await response.json();

                    const poll_ = data.find((p) => p.id === Number(pollId));

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

        fetchPoll();
    }, []);

    const handleAnswerChange = (questionId, answerId) => {
        setSelectedAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answerId,
        }));
    };

    return (
        <div className="publicPoll">
        {!showVoting ? (
            <div className="publicData">
            <h1>Please fill out your data</h1>
            <form>
            <div>
            <label
            htmlFor="gender"
            className="required-label"
            >
            Gender:
            </label>
            <select
            id="gender"
            required
            onChange={(e) => setGender(e.target.value)}
            className={`required-${formErrors.gender ? 'invalid' : '1'}`}
            >
            <option value="">Select a gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            </select>
            {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
            </div>

            <div>
            <label
            htmlFor="age"
            className="required-label"
            >
            Your Age:
            </label>
            <input
            type="text"
            id="age"
            required
            placeholder="Your Age"
            onChange={(e) => setAge(e.target.value)}
            className={`required-${formErrors.age ? 'invalid' : '1'}`}
            />
            {formErrors.age && <span className="error-message">{formErrors.age}</span>}
            </div>

            <div>
            <label
            htmlFor="job"
            className="required-label"
            >
            Your Job:
            </label>
            <input
            type="text"
            id="job"
            required
            placeholder="Your Job"
            onChange={(e) => setJob(e.target.value)}
            className={`required-${formErrors.job ? 'invalid' : '1'}`}
            />
            {formErrors.job && <span className="error-message">{formErrors.job}</span>}
            </div>
            <button type="submit" onClick={handleSubmit}>Submit</button>
            </form>
            </div>
        ) : (
            <div className="publicVote">
            <h2>{poll.name}</h2>
            <h4 className="Beschreibung">Beschreibung: </h4>
            <h5 className="Beschreibung">{poll.description}</h5>
            <br />
            {poll.Questions &&
                poll.Questions.map((question) => (
                    <div key={question.id} className="question">
                    <h3>{question.name}</h3>
                    {question.Answers &&
                        question.Answers.map((answer) => (
                            <div key={answer.id} className="answer">
                            <label className="answer" key={answer.id}>
                            <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={answer.id}
                            checked={selectedAnswers[question.id] === answer.id}
                            onChange={() => handleAnswerChange(question.id, answer.id)}
                            />
                            <span>{answer.name}</span>
                            </label>
                            </div>
                        ))}
                        </div>
                ))}
                </div>
        )}
        </div>
    );
};

export default PublicPolls;
