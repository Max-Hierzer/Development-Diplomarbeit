import React, { useState, useEffect } from 'react';

function EditPolls({ selectedPoll }) {
    const [poll, setPoll] = useState('');
    const [questions, setQuestions] = useState([]);
    const [response, setResponse] = useState('');
    const [description, setDescription] = useState('');

    // Initialize state with `selectedPoll`
    useEffect(() => {
        if (selectedPoll) {
            setPoll(selectedPoll.name || '');
            setDescription(selectedPoll.description || '');
            setQuestions(
                (selectedPoll.Questions || []).map((q) => ({
                    ...q,
                    Answers: q.Answers || [{ name: '' }, { name: '' }],
                }))
            );
        }
    }, [selectedPoll]);

    const addQuestion = () => {
        setQuestions([...questions, { id: null, name: '', Answers: [{ name: '' }, { name: '' }] }]);
    };

    const addAnswer = (questionIndex) => {
        setQuestions(
            questions.map((q, index) =>
            index === questionIndex
            ? { ...q, Answers: [...q.Answers, { name: '' }] }
            : q
            )
        );
    };

    const deleteQuestion = (questionIndex) => {
        setQuestions((prevQuestions) =>
        prevQuestions.filter((_, index) => index !== questionIndex)
        );
    };

    const deleteAnswer = (questionIndex, answerIndex) => {
        setQuestions((prevQuestions) =>
        prevQuestions.map((q, qIndex) =>
        qIndex === questionIndex
        ? {
            ...q,
            Answers: q.Answers.filter((_, aIndex) => aIndex !== answerIndex),
        }
        : q
        )
        );
    };

    const handleQuestionChange = (index, value) => {
        setQuestions(
            questions.map((q, qIndex) =>
            qIndex === index ? { ...q, name: value } : q
            )
        );
    };

    const handleAnswerChange = (questionIndex, answerIndex, value) => {
        setQuestions((prevQuestions) =>
        prevQuestions.map((q, qIndex) =>
        qIndex === questionIndex
        ? {
            ...q,
            Answers: q.Answers.map((a, aIndex) =>
            aIndex === answerIndex ? { ...a, name: value } : a
            ),
        }
        : q
        )
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const current_datetime = new Date().toISOString();
        if (selectedPoll.publish_date > current_datetime){
            const payload = {
                pollId: selectedPoll.id,
                pollName: poll,
                pollDescription: description,
                Questions: questions.map((q) => ({
                    id: q.id || null,
                    name: q.name,
                    Answers: q.Answers.map((a) => ({
                        id: a.id || null,
                        name: a.name,
                    })),
                })),
            };

            try {
                const res = await fetch(`http://localhost:3001/api/polls/${selectedPoll.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();

                if (res.ok) {
                    setResponse(`Poll updated successfully`);
                } else {
                    setResponse(`Error: ${data.error || 'Something went wrong'}`);
                }
            } catch (error) {
                console.error('Error updating poll:', error);
                setResponse('Error updating poll');
            }
        }
        else{
            setResponse('Poll has already started.')
        }
    };

    return (
        <div>
        {selectedPoll ? (
            <form onSubmit={handleSubmit}>
            <h1>Edit Poll</h1>
            <input
            type="text"
            value={poll}
            onChange={(e) => setPoll(e.target.value)}
            placeholder="Poll Name"
            />
            <h4>Description</h4>
            <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            />
            {questions.map((question, questionIndex) => (
                <div key={question.id || questionIndex}>
                <input
                type="text"
                placeholder={`Question ${questionIndex + 1}`}
                value={question.name}
                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                />
                <button type="button" onClick={() => deleteQuestion(questionIndex)}>
                Delete Question
                </button>
                <h4>Answers</h4>
                {question.Answers.map((answer, answerIndex) => (
                    <div key={answer.id || answerIndex}>
                    <input
                    type="text"
                    placeholder={`Answer ${answerIndex + 1}`}
                    value={answer.name}
                    onChange={(e) =>
                        handleAnswerChange(questionIndex, answerIndex, e.target.value)
                    }
                    />
                    <button
                    type="button"
                    onClick={() => deleteAnswer(questionIndex, answerIndex)}
                    >
                    Delete Answer
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
            <button type="submit">Submit Changes</button>
            </form>
        ) : (
            <p>Please select a poll</p>
        )}
        <p>{response}</p>
        </div>
    );
}

export default EditPolls;
