import React, { useState, useEffect } from 'react';

function EditPolls({ selectedPoll }) {
    const [poll, setPoll] = useState('');
    const [questions, setQuestions] = useState([]);

    // Initialize state with `selectedPoll`
    useEffect(() => {
        if (selectedPoll) {
            setPoll(selectedPoll.name || '');
            setQuestions(
                (selectedPoll.Questions || []).map((q) => ({
                    ...q,
                    Answers: q.Answers || [{ name: '' }, { name: '' }], // Map `Answers` to `answers` for consistency
                }))
            );
        }
    }, [selectedPoll]);

    const addQuestion = () => {
        setQuestions([...questions, { name: '', Answers: [{ name: '' }, { name: '' }] }]);
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
        setQuestions(questions.filter((_, index) => index !== questionIndex));
    };

    const deleteAnswer = (questionIndex, answerIndex) => {
        setQuestions(
            questions.map((q, qIndex) =>
            qIndex === questionIndex
            ? { ...q, Answers: q.Answers.filter((_, aIndex) => aIndex !== answerIndex) }
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedPoll = { name: poll, Questions: questions };
        console.log("Updated Poll:", updatedPoll);
        // Optionally pass updatedPoll to a parent or API
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
            {questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                <input
                type="text"
                placeholder={`Question ${questionIndex + 1}`}
                value={question.name}
                onChange={(e) =>
                    handleQuestionChange(questionIndex, e.target.value)
                }
                />
                <button
                type="button"
                onClick={() => deleteQuestion(questionIndex)}
                >
                Delete Question
                </button>
                <h4>Answers</h4>
                {question.Answers?.map((answer, answerIndex) => (
                    <div key={answerIndex}>
                    <input
                    type="text"
                    placeholder={`Answer ${answerIndex + 1}`}
                    value={answer.name}
                    onChange={(e) =>
                        handleAnswerChange(
                            questionIndex,
                            answerIndex,
                            e.target.value
                        )
                    }
                    />
                    <button
                    type="button"
                    onClick={() =>
                        deleteAnswer(questionIndex, answerIndex)
                    }
                    >
                    Delete Answer
                    </button>
                    </div>
                ))}
                <button
                type="button"
                onClick={() => addAnswer(questionIndex)}
                >
                Add Answer
                </button>
                </div>
            ))}
            <button type="button" onClick={addQuestion}>
            Add Question
            </button>
            <button type="submit">Submit Changes</button>
            </form>
        ) : (
            <p>Please select a poll</p>
        )}
        </div>
    );
}

export default EditPolls;
