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

    // Mark the form as submitted
    const publicDataElement = document.querySelector('.publicData');
    publicDataElement.classList.add('submitted');

    // Validate form fields
    const newFormErrors = {};
    if (!gender) newFormErrors.gender = '*';
    if (!age || isNaN(age) || parseInt(age) < 0) newFormErrors.age = 'Bitte geben Sie eine Zahl an.';
    if (!job) newFormErrors.job = '*';

    setFormErrors(newFormErrors);
    if (Object.keys(newFormErrors).length > 0) {
      alert('Bitte füllen Sie alle Felder aus.');
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-recaptcha`, {
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
          const res = await fetch(`${process.env.REACT_APP_API_URL}/api/vote/public`, {
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
          const response = await fetch(`${process.env.REACT_APP_API_URL}/results/polls`);
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
    <div className="public-container">
    <ReCAPTCHA
    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
    size="invisible"
    ref={recaptchaRef}
    />
    {poll ? (
      !showVoting ? (
        <div className="publicData">
          <h2>Bitte beantworten sie die folgenden Fragen.</h2>
          <form onSubmit={handleSubmitData}>
            <div>
              <label htmlFor="gender" className="required-label">Wählen Sie Ihr Geschlecht:</label>
              <select
                id="gender"
                required
                onChange={(e) => setGender(e.target.value)}
                className={`required ${formErrors.gender ? 'invalid' : ''}`}
              >
              <option value="">-</option>
              <option value="male">männlich</option>
              <option value="female">weiblich</option>
              <option value="non-binary">divers</option>
              </select>
              {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
            </div>
            <div>
              <label htmlFor="age" className="required-label">Wie alt sind Sie:</label>
              <input
                type="text"
                id="age"
                required
                placeholder="Ihr Alter"
                onChange={(e) => setAge(e.target.value)}
                className={`required ${formErrors.age ? 'invalid' : ''}`}
              />
              {formErrors.age && <span className="error-message">{formErrors.age}</span>}
            </div>
            <div>
              <label htmlFor="job" className="required-label">Ihr Beruf:</label>
              <input
                type="text"
                id="job"
                required
                placeholder="Ihr Beruf"
                onChange={(e) => setJob(e.target.value)}
                className={`required ${formErrors.job ? 'invalid' : ''}`}
              />
              {formErrors.job && <span className="error-message">{formErrors.job}</span>}
            </div>
            <button type="submit">Submit Data</button>
          </form>
        </div>
      ) : (
        <div className="vote-container">
        <h2><span>{poll.name}</span></h2>
        {poll.description && (
          <div>
          <h4 className="description-header">Beschreibung:</h4>
          <h5 className="description">{poll.description}</h5>
          </div>
        )}
        <br />
        {poll.Questions &&
          poll.Questions.map((question) => (
            <div key={question.id} className="question">
            <h3 className="question-header">
            <span className="question-text">{question.name}</span>
            <span className="question-type">{question.QuestionType.name}</span>
            </h3>
            {question.Answers &&
              question.Answers.map((answer) => (
                <div key={answer.id} className="answer">
                <input
                type={question.QuestionType.name === "Multiple Choice" ? "checkbox" : "radio"}
                name={`question-${question.id}`}
                value={answer.id}
                checked={
                  question.QuestionType.name === "Multiple Choice"
                  ? !!selectedAnswers[question.id]?.answer?.includes(answer.id)
                  : selectedAnswers[question.id]?.answer?.[0] === answer.id
                }
                onChange={(event) =>
                  handleAnswerChange(question.id, answer.id, question.QuestionType.name === "Multiple Choice", event.target.checked)
                }
                />
                <label>{answer.name}</label>
                </div>
              ))}
              {question.QuestionType.name === "Weighted Choice" && (
                <ImportanceScale
                questionId={question.id}
                onImportanceChange={handleImportanceChange}
                />
              )}
              </div>
          ))}
          <button className="vote-button" onClick={handleVoteSubmit}>Submit Vote</button>
          </div>
      )
    ) : (
      <p>Poll not available</p>
    )}
    </div>
  );
};

export default PublicPolls;
