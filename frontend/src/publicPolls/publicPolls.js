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
  const [pollValue, setPollValue] = useState(0);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [publicQuestions, setPublicQuestions] = useState([]);
  const [selectedPublicAnswers, setSelectedPublicAnswers] = useState({});

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

  useEffect(() => {
    if (poll) { // Check if poll exists before accessing its properties
      setPublicQuestions(poll.publicPollQuestions);
    }
  }, [poll]);

  // Handle the first form submission (to verify user data and execute reCAPTCHA)
  const handleSubmitData = async (event) => {
    event.preventDefault();
    console.log("Form submission triggered");

    // Mark the form as submitted
    const publicDataElement = document.querySelector('.publicData');
    publicDataElement.classList.add('submitted');

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
        handleVoteSubmit();
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
          const res = await fetch(`${process.env.REACT_APP_API_URL}/public/vote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pollId: poll.id,
              answers: selectedAnswers,
              publicAnswers: selectedPublicAnswers,
            }),
          });

          if (res.ok) {
            console.log("Voted successfully");
            setVoteSubmitted(true);
          }
        } catch (error) {
          console.error('Error submitting vote:', error);
        }
      } else {
        console.log('Poll has already ended');
      }
    } else {
      alert('You have already submitted your vote.');
    }
  };

  // Fetch the poll data from the backend.
  useEffect(() => {
    const fetchPoll = async () => {
      if (pollValue) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/public/poll/${pollValue}`);
          const poll_ = await response.json();
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
  const handleAnswerChange = (questionId, answerId, isMultipleChoice = false, checked = false, isPublic = false) => {
    if (isPublic) {
      setSelectedPublicAnswers((prevAnswers) => {
        return {
          ...prevAnswers,
          [questionId]: {
            answer: isMultipleChoice
              ? (checked
                ? [...(prevAnswers[questionId]?.answer || []), answerId]  // Add answer
                : (prevAnswers[questionId]?.answer || []).filter((id) => id !== answerId)) // Remove answer
              : [answerId], // Single choice overwrites
            importance: prevAnswers[questionId]?.importance || null,
          },
        };
      });
    } else {
      setSelectedAnswers((prevAnswers) => {
        return {
          ...prevAnswers,
          [questionId]: {
            answer: isMultipleChoice
              ? (checked
                ? [...(prevAnswers[questionId]?.answer || []), answerId]  // Add answer
                : (prevAnswers[questionId]?.answer || []).filter((id) => id !== answerId)) // Remove answer
              : [answerId], // Single choice overwrites
            importance: prevAnswers[questionId]?.importance || null,
          },
        };
      });
    }
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
        showVoting ? (
          <div className="publicData">
            <h2><span>{poll.name}</span></h2>
            {poll.description && (
              <div className='display-description'>
                <h4 className="description-header">Beschreibung:</h4>
                <h5 className="description">{poll.description}</h5>
              </div>
            )}
            <form onSubmit={handleSubmitData}>
              <div>
                {publicQuestions &&
                  publicQuestions.map((question) => {
                    const isMultipleChoice = question.QuestionType.name === "Multiple Choice";
                    return (
                      <div key={question.id} className="demographicQuestion">
                        <h3 className="question-header">
                          <span className="question-text">{question.name}</span>
                          <span className="question-type">{question.QuestionType.name}</span>
                        </h3>
                        {question.PublicAnswers &&
                          question.PublicAnswers.map((answer) => (
                            <div key={answer.id} className="answer">
                              <input
                                type={isMultipleChoice ? "checkbox" : "radio"}
                                name={`question-${question.id}`}
                                value={answer.id}
                                checked={
                                  isMultipleChoice
                                    ? !!selectedPublicAnswers[question.id]?.answer?.includes(answer.id)
                                    : selectedPublicAnswers[question.id]?.answer?.[0] === answer.id
                                }
                                onChange={(event) =>
                                  handleAnswerChange(question.id, answer.id, isMultipleChoice, event.target.checked, true)
                                }
                              />
                              <label>{answer.name}</label>
                            </div>
                          ))}
                      </div>
                    );
                  })}
              </div>
              {!voteSubmitted && (
                <button
                type="submit"
                className="vote-button"
                onClick={handleVoteSubmit}
                title={'Klicken Sie hier um die Umfrage abzuschließen.'}
                >Umfrage abschließen</button>
              )}

              {voteSubmitted && (
                <><button
                className={'disabled-button'}
                disabled
                title={'Auf diese Umfrage haben Sie bereits abgestimmt.'}
                >
                Umfrage abschließen
                </button><p className="success-message">
                Danke für Ihre Teilnahme an dieser Umfrage.<br />
                Falls Sie sich weiter informieren wollen, besuchen Sie gerne unsere <a href="https://liste-petrovic.at/" target="_blank" rel="noopener noreferrer">Website</a>.
                </p></>
              )}
            </form>
          </div>
        ) : (
          <div className="vote-container">
            <h2><span>{poll.name}</span></h2>
            {poll.description && (
              <div className='display-description'>
                <h4 className="description-header">Beschreibung:</h4>
                <h5 className="description">{poll.description}</h5>
              </div>
            )}
            <br />
            {poll.Questions &&
              poll.Questions.map((question) => (
                <div key={question.id} className="publicQuestion">
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
              <button
              className="vote-button"
              onClick={() => setShowVoting(true)}
              title={'Klicken Sie hier um ihre Stimme abzugeben.'}
              >Stimme abgeben</button>
          </div>
        )
      ) : (
        <p>Poll not available</p>
      )}
    </div>
  );
};

export default PublicPolls;
