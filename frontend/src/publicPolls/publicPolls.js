import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import ReCAPTCHA from 'react-google-recaptcha';
import './publicPolls.css';
import Voting from '../voting/Voting';
import ImportanceScale from '../voting/ImportanceScale';

const PublicPolls = () => {
  const [showVoting, setShowVoting] = useState(false);
  const [poll, setPoll] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [pollValue, setPollValue] = useState(0);

  // Always mounted recaptcha reference
  const recaptchaRef = useRef(null);

  // Check periodically that the recaptcha reference is available.
  useEffect(() => {
    const checkRecaptcha = setInterval(() => {
      if (recaptchaRef.current) {
        clearInterval(checkRecaptcha);
      }
    }, 500);
    return () => clearInterval(checkRecaptcha);
  }, []);

  // Handle the first form submission (to verify user data and execute reCAPTCHA)
  const handleSubmitData = async (event) => {
    event.preventDefault();
    console.log("Form submission triggered");

    // Validate form fields
    const newFormErrors = {};
    if (!gender) newFormErrors.gender = '*';
    if (!age || isNaN(age) || parseInt(age) < 0) newFormErrors.age = 'Please enter a valid age.';
    if (!job) newFormErrors.job = '*';

    setFormErrors(newFormErrors);
    if (Object.keys(newFormErrors).length > 0) {
      alert('Please fill out all fields.');
      return;
    }

    // Ensure reCAPTCHA is ready before execution.
    if (!recaptchaRef.current || !recaptchaRef.current.executeAsync) {
      console.error("reCAPTCHA is not ready yet.");
      alert("reCAPTCHA is still loading. Please try again.");
      return;
    }

    try {
      console.log("Executing reCAPTCHA...");
      const token = await recaptchaRef.current.executeAsync();
      if (!token) return;

      // Send the token to your backend for verification.
      console.log("Sending reCAPTCHA token to backend...");
      const response = await fetch("http://localhost:3001/verify-recaptcha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("CAPTCHA validation successful!");
        setShowVoting(true);
      } else {
        console.error("CAPTCHA validation failed:", result);
        alert("CAPTCHA verification failed. Please try again.");
      }
      // Reset the recaptcha widget after execution.
      recaptchaRef.current.reset();
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      alert("An error occurred while verifying reCAPTCHA.");
    }
  };

  // Parse poll parameter from the URL.
  useEffect(() => {
    const linkParam = window.location.search.substring(1);
    if (linkParam) {
      const unhashed = atob(decodeURIComponent(linkParam));
      const params = new URLSearchParams(unhashed);
      const pollValue = params.get('poll');
      setPollValue(pollValue ? pollValue : 0);
    }
  }, []);

  // Submit the vote.
  const handleVoteSubmit = async () => {
    if (!(Object.keys(selectedAnswers).length === poll.Questions.length)) {
      alert('Please select all questions');
      return;
    }
    if (!Cookies.get('pollSubmitted')) {
      // Mark the poll as submitted by setting the cookie.
      Cookies.set('pollSubmitted', 'true', {
        expires: new Date(poll.end_date),
        SameSite: 'None',
        Secure: true,
      });
      const current_datetime = new Date().toISOString();
      if (poll.end_date > current_datetime) {
        try {
          const res = await fetch('http://localhost:3001/api/vote/public', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              answers: selectedAnswers,
              userData: {
                gender,
                age: parseInt(age),
                job,
                pollId: poll.id,
              },
            }),
          });

          if (res.ok) {
            console.log("Voted successfully");
          }
        } catch (error) {
          console.error('Error submitting vote:', error);
        }
      } else {
        console.log('Poll has already ended');
      }
      alert('Vote submitted!');
    } else {
      alert('You have already submitted your vote.');
    }
  };

  // Fetch the poll data from the backend.
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

  // Update selected answers when a user selects an answer.
  const handleAnswerChange = (questionId, answerId, isMultipleChoice = false, checked = false) => {
    setSelectedAnswers((prevAnswers) => {
      if (isMultipleChoice) {
        const currentAnswers = prevAnswers[questionId]?.answer || [];
        return {
          ...prevAnswers,
          [questionId]: {
            answer: checked
              ? [...currentAnswers, answerId]
              : currentAnswers.filter((id) => id !== answerId),
            importance: prevAnswers[questionId]?.importance || null,
          },
        };
      } else {
        return {
          ...prevAnswers,
          [questionId]: {
            answer: [answerId],
            importance: prevAnswers[questionId]?.importance || null,
          },
        };
      }
    });
  };

  // Update the importance scale value for weighted questions.
  const handleImportanceChange = (questionId, importance) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: {
        ...prevAnswers[questionId],
        importance,
      },
    }));
  };

  return (
    <div className="publicPoll">
      {/* Render the reCAPTCHA component always so it is not unmounted.
          It is set to invisible so it won’t show in your UI. */}
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} // Replace with your actual site key.
        size="invisible"
        ref={recaptchaRef}
      />

      {poll ? (
        !showVoting ? (
          <div className="publicData">
            <h1>Please fill out your data</h1>
            <form onSubmit={handleSubmitData}>
              <div>
                <label htmlFor="gender" className="required-label">Gender:</label>
                <select
                  id="gender"
                  required
                  onChange={(e) => setGender(e.target.value)}
                  className={`required${formErrors.gender ? ' invalid' : ''}`}
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
                  className={`required${formErrors.age ? ' invalid' : ''}`}
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
                  className={`required${formErrors.job ? ' invalid' : ''}`}
                />
                {formErrors.job && <span className="error-message">{formErrors.job}</span>}
              </div>

              <button type="submit">Submit</button>
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
            <button onClick={handleVoteSubmit}>Submit Vote</button>
          </div>
        )
      ) : (
        "Poll not available"
      )}
    </div>
  );
};

export default PublicPolls;
