import React, { useState } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import PollValidators from './ValidatePoll';

function CreatePoll() {
    const [poll, setPoll] = useState('');
    const [description, setDescription] = useState('');
    const [voteLink, setVoteLink] = useState('');
    const [resultsLink, setResultsLink] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [resetKey, setResetKey] = useState(0);
    const [questions, setQuestions] = useState([{ name: '', type: 'Single Choice', answers: [{ name: '' }, { name: '' }] }]);
    const [response, setResponse] = useState(null);
    const [selectedPublic, setSelectedPublic] = useState('No');
    const [selectedAnon, setSelectedAnon] = useState('Yes');

    const handleSubmit = async (event) => {
        event.preventDefault();

        let isPublic = selectedPublic === "Yes";
        let isAnon = selectedAnon === "Yes";

        const payload = {
            poll: { name: poll, description: description, userId: sessionStorage.getItem('userId'), public: isPublic, anon: isAnon, publishDate: publishDate, endDate: endDate},
            questions
        };

        console.log(JSON.stringify(payload, null, 2));

        const error = PollValidators.validatePollData(poll, publishDate, endDate, questions);
        if (error) {
            setResponse(error);
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/poll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setResponse(`Poll created successfully`);
                setPoll('');
                setQuestions([{ name: '', type: 'Single Choice', answers: [{ name: '' }, { name: '' }] }]);
                setDescription('');
                setPublishDate('');
                setEndDate('');
                setResetKey(resetKey + 1);
                setSelectedPublic('No');
                setSelectedAnon('Yes');
            } else {
                setResponse(`Error: ${data.error || 'Something went wrong'}`);
            }
        } catch (error) {
            console.error('Error submitting poll:', error);
            setResponse('Error submitting poll');
        }
    };

    const addQuestion = () => {
        const newQuestions = [...questions];
        newQuestions.push({ name: '', type: 'Single Choice', answers: [{ name: '' }, { name: '' }] });
        setQuestions(newQuestions);
    };

    const addAnswer = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.push({ name: '' });
        setQuestions(newQuestions);
    };

    const deleteQuestion = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions.splice(questionIndex, 1);
        setQuestions(newQuestions);
    };

    const deleteAnswer = (questionIndex, answerIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers.splice(answerIndex, 1);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].name = value;
        setQuestions(newQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].answers[answerIndex].name = value;
        setQuestions(newQuestions);
    };

    const handleQuestionTypes = (questionIndex, value) => {
        const newType = [...questions];
        newType[questionIndex].type = value;
        setQuestions(newType);
    }


    return (
        <div>
        <form onSubmit={handleSubmit}>
        <h1>Poll</h1>
        <input
        type="text"
        placeholder={`Pollname`}
        value={poll}
        onChange={(e) => setPoll(e.target.value)}
        />
        <br />
        <textarea
        placeholder="Poll Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5} // Adjust the number of rows for the desired height
        cols={50} // Adjust the number of columns for the desired width
        style={{ resize: 'vertical' }} // Optional: Allow resizing vertically only
        />
        <br />
        <br />
        <h4>Public</h4>
        <select onChange={(e) => setSelectedPublic(e.target.value)} value={selectedPublic}>
            <option>No</option>
            <option>Yes</option>
        </select>
        <br />
        <br />
        {selectedPublic === "No" && (
            <div>
            <h4>Anonymous</h4>
            <select onChange={(e) => setSelectedAnon(e.target.value)} value={selectedAnon}>
                <option>Yes</option>
                <option>No</option>
            </select>
            <br />
            <br />
            </div>
        )}
        <div className="datetime-container">
            <Datetime
                key={`publish-${resetKey}`}
                value={publishDate}
                onChange={(date) => setPublishDate(date)}
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm"
                closeOnSelect={true}
                inputProps={{ placeholder: "Publish Date" }}
            />
        </div>
        <div className="datetime-container">
            <Datetime
                key={`end-${resetKey}`}
                value={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="DD/MM/YYYY"
                timeFormat="HH:mm"
                closeOnSelect={true}
                inputProps={{ placeholder: "End Date" }}
            />
        </div>
        <br />
        <br />
        {questions.map((question, questionIndex) => (
            <div key={questionIndex}>
            <h3>Question</h3>
            <br />
            <h4>Type</h4>
            <select onChange={(e) => handleQuestionTypes(questionIndex, e.target.value)} value={question.type}>
                <option>Single Choice</option>
                <option>Multiple Choice</option>
                <option>Weighted Choice</option>
            </select>
            <br />
            <input
            type="text"
            placeholder={`Question ${questionIndex + 1}`}
            value={question.name}
            onChange={(e) =>
                handleQuestionChange(questionIndex, e.target.value)
            }
            /><button type="button" onClick={() => deleteQuestion(questionIndex)}>
            Delete
            </button>
            <h4>Answers</h4>
            {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex}>
                <input
                type="text"
                placeholder={`Answer ${answerIndex + 1}`}
                value={answer.name}
                onChange={(e) =>
                    handleAnswerChange(questionIndex, answerIndex, e.target.value)
                }
                /><button type="button" onClick={() => deleteAnswer(questionIndex, answerIndex)}>
                Delete
                </button>
                </div>
            ))}
            <button type="button" onClick={() => addAnswer(questionIndex)}>
            Add Answer
            </button>
            </div>
        ))}
        <button type="button" onClick={addQuestion}>
        Add Question
        </button>

        <br />
        <button type="submit">Submit</button>
        </form>
        <p>{response}</p>
        </div>
    );
}

export default CreatePoll;
