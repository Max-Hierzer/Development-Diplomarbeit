import React, { useState } from 'react';

function CreatePoll() {
    const [poll, setPoll] = useState('');
    const [questions, setQuestions] = useState([{ name: '', answers: [{ name: '' }, { name: '' }] }]);
    const [response, setResponse] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            poll: { name: poll },
            questions,
        };

        console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

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
                setQuestions([{ name: '', answers: [{ name: '' }, { name: '' }] }]);
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
        newQuestions.push({ name: '', answers: [{ name: '' }, { name: '' }] });
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

        <h3>Questions</h3>
        {questions.map((question, questionIndex) => (
            <div key={questionIndex}>
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
