import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import ReCAPTCHA from 'react-google-recaptcha';
import './publicPolls.css';

const PublicPolls = () => {
    const [showVoting, setShowVoting] = useState(false);
    const [poll, setPoll] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [job, setJob] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const recaptchaRef = useRef(null);
    const [pollValue, setPollValue] = useState(0);


    const handleSubmitData = async (event) => {
        event.preventDefault();

        const newFormErrors = {};
        if (!gender) newFormErrors.gender = '*';
        if (!age) newFormErrors.age = '*';
        if (!job) newFormErrors.job = '*';

        setFormErrors(newFormErrors);

        if (Object.keys(newFormErrors).length === 0) {
            // Trigger reCAPTCHA validation before proceeding
            const token = await recaptchaRef.current.executeAsync();
            recaptchaRef.current.reset(); // Reset CAPTCHA after execution
            if (token) {
                // Send the CAPTCHA token to the backend for validation
                const response = await fetch('http://localhost:3001/verify-recaptcha', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const result = await response.json();
                if (result.success) {
                    // Proceed to show the voting section after successful CAPTCHA validation
                    setShowVoting(true);
                } else {
                    alert('CAPTCHA verification failed. Please try again.');
                }
            } else {
                alert('CAPTCHA verification failed.');
            }
        } else {
            alert('Please fill out all fields.');
        }
    };

    useEffect(() => {
        const linkParam = new URLSearchParams(window.location.search);
        const hashed = linkParam.toString();
        const paddedVoteHash = hashed.padEnd(hashed.length + (4 - (hashed.length % 4)) % 4, '=');
        const unhashed = atob(paddedVoteHash);
        const params = new URLSearchParams(unhashed);
        const pollValue = params.get('poll');
        if (pollValue) {
            setPollValue(pollValue);
        } else {
            setPollValue(0);
        }
    }, []);

    const handleVoteSubmit = async () => {
        if (!Cookies.get('pollSubmitted')) {
            // Mark the poll as submitted by setting the cookie
            Cookies.set('pollSubmitted', 'true', {
                expires: 1, // Expire in 1 day
                SameSite: 'None', // For cross-site access (reCAPTCHA)
            Secure: true, // Only works over HTTPS
            });

            alert('Vote submitted!');
            // After submitting the vote, you can either submit the vote data to the backend
            // or display a success message.
        } else {
            alert('You have already submitted your vote.');
        }
        const current_datetime = new Date().toISOString();
        if (poll.end_date > current_datetime) {
            if (!(Object.keys(selectedAnswers).length === poll.Questions.length)) {
                console.log('Please select all questions');
                return;
            }

            try {
                const res = await fetch('http://localhost:3001/api/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        answers: selectedAnswers,
                    }),
                });

                if (res.ok) {
                    console.log("voted successfully")
                } else {
                    alert(`User has already voted.`);
                }
            } catch (error) {
                console.error('Error submitting vote:', error);
            }
        }
        else {
            console.log('Poll has already ended')
        }
    };

    useEffect(() => {
        const fetchPoll = async () => {
            if (pollValue) {
                try {
                    const response = await fetch('http://localhost:3001/results/polls');
                    const data = await response.json();
                    const poll_ = data.find((p) => p.id === Number(pollValue));
                    if (poll_) {
                        const currentDateTime = new Date().toISOString();
                        if (poll_.publish_date <= currentDateTime && poll_.end_date >= currentDateTime) {
                            setPoll(poll_);
                        } else {
                            setPoll(null);
                        }
                    } else {
                        setPoll(null);
                    }
                } catch (error) {
                    console.error('Error fetching polls:', error);
                    setPoll(null);
                }
            }
        };

        fetchPoll();
    }, [pollValue]);

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
            <label htmlFor="gender" className="required-label">Gender:</label>
            <select
            id="gender"
            required
            onChange={(e) => setGender(e.target.value)}
            className={`required${formErrors.gender ? 'invalid' : ''}`}
            >
            <option value="">Select a gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            </select>
            {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
            </div>

            <div>
            <label htmlFor="age" className="required-label">Your Age:</label>
            <input
            type="text"
            id="age"
            required
            placeholder="Your Age"
            onChange={(e) => setAge(e.target.value)}
            className={`required${formErrors.age ? 'invalid' : ''}`}
            />
            {formErrors.age && <span className="error-message">{formErrors.age}</span>}
            </div>

            <div>
            <label htmlFor="job" className="required-label">Your Job:</label>
            <input
            type="text"
            id="job"
            required
            placeholder="Your Job"
            onChange={(e) => setJob(e.target.value)}
            className={`required${formErrors.job ? 'invalid' : ''}`}
            />
            {formErrors.job && <span className="error-message">{formErrors.job}</span>}
            </div>

            <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} // Replace with your actual site key
            size="invisible"
            ref={recaptchaRef}
            />
            <button type="submit" onClick={handleSubmitData}>Submit</button>
            </form>
            </div>
        ) : (
            <div className="publicVote">
            <h2>{poll.name}</h2>
            <h4 className="Beschreibung">Beschreibung:</h4>
            <h5 className="Beschreibung">{poll.description}</h5>
            <br />
            {poll.Questions &&
                poll.Questions.map((question) => (
                    <div key={question.id} className="question">
                    <h3>{question.name}</h3>
                    {question.Answers &&
                        question.Answers.map((answer) => (
                            <div key={answer.id} className="answer">
                            <label>
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
                <button onClick={handleVoteSubmit}>Submit Vote</button>
                </div>
        )}
        </div>
    );
};

export default PublicPolls;
