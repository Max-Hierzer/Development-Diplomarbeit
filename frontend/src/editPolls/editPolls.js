import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import "../styles/create.css";

function EditPolls({ selectedPoll }) {
    const [poll, setPoll] = useState('');
    const [questions, setQuestions] = useState([]);
    const [response, setResponse] = useState('');
    const [description, setDescription] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isPublic, setIsPublic] = useState('');
    const [isAnon, setIsAnon] = useState('');
    const [submitted, setSubmitted] = useState(null);

    // Initialize state with `selectedPoll`
    useEffect(() => {
        if (selectedPoll) {
            let publicState;
            let anonState;
            const publish = new Date(selectedPoll.publish_date);
            const end = new Date(selectedPoll.end_date);
            setPoll(selectedPoll.name || '');
            setDescription(selectedPoll.description || '');
            if (selectedPoll.public.toString() === "true") publicState = "Ja";
            else if (selectedPoll.public.toString() === "false") publicState = "Nein";
            setIsPublic(publicState || '');
            if (selectedPoll.anonymous.toString() === "true") anonState = "Ja";
            else if (selectedPoll.anonymous.toString() === "false") anonState = "Nein";
            setIsAnon(anonState || '');
            setPublishDate(publish || '');
            setEndDate(end || '');
            setQuestions(
                (selectedPoll.Questions || []).map((q) => ({
                    ...q,
                    Answers: q.Answers || [{ name: '' }, { name: '' }],
                }))
            );
        }
    }, [selectedPoll]);

    const addQuestion = () => {
        setQuestions([...questions, { id: null, name: '', QuestionType: { name: 'Single Choice'}, Answers: [{ name: '' }, { name: '' }] }]);
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

    const handleQuestionTypes = (questionIndex, value) => {
        const newType = [...questions];
        newType[questionIndex].QuestionType.name = value;
        setQuestions(newType);
    };

    const handlePublicChange = (value) => {
        if (value === "Ja") setIsAnon(value);
        setIsPublic(value);
    };

    const handleAnonChange = (value) => {
        setIsAnon(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const current_datetime = new Date().toISOString();
        if (selectedPoll.publish_date > current_datetime){
            const payload = {
                pollId: selectedPoll.id,
                pollName: poll,
                isPublic: isPublic === "Ja",
                isAnonymous: isAnon === "Ja",
                pollDescription: description,
                publishDate: publishDate,
                endDate: endDate,
                Questions: questions.map((q) => ({
                    id: q.id || null,
                    name: q.name,
                    type: q.QuestionType.name,
                    Answers: q.Answers.map((a) => ({
                        id: a.id || null,
                        name: a.name,
                    })),
                })),
            };
            console.log(JSON.stringify(payload, null, 2));

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
                    setSubmitted(1);
                    setTimeout(() => setSubmitted(null), 1000);
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
        <div className="edit-content">
            <form onSubmit={handleSubmit} className="edit-form">
            <h1>Edit Poll</h1>
            <input
            type="text"
            value={poll}
            onChange={(e) => setPoll(e.target.value)}
            placeholder="Poll Name"
            />
            <h4>Description</h4>
            <textarea
            placeholder="Poll Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5} // Adjust the number of rows for the desired height
            cols={50} // Adjust the number of columns for the desired width
            style={{ resize: 'vertical' }} // Optional: Allow resizing vertically only
            className="description"
            />
            <br />
            <br />
            <h4>Public</h4>
            <select onChange={(e) => handlePublicChange(e.target.value)} value={isPublic} className="select-public">
                <option>Nein</option>
                <option>Ja</option>
            </select>
            <br />
            <br />
            {isPublic === "Nein" && (
                <div>
                <h4>Anonymous</h4>
                <select onChange={(e) => handleAnonChange(e.target.value)} value={isAnon} className="select-anon">
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                <br />
                <br />
                </div>
            )}
            <div className="datetime-container">
                <div className="start-date">
                    <h4>Startzeitpunkt</h4>
                    <Datetime
                        value={publishDate}
                        onChange={(date) => setPublishDate(date)}
                        dateFormat="DD/MM/YYYY"
                        timeFormat="HH:mm"
                        closeOnSelect={true}
                        //inputProps={{ placeholder: "Publish Date" }}
                    />
                </div>
                <div className="end-date">
                    <h4>Endzeitpunkt</h4>
                    <Datetime
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="DD/MM/YYYY"
                        timeFormat="HH:mm"
                        closeOnSelect={true}
                        //inputProps={{ placeholder: "End Date" }}
                    />
                </div>
            </div>
            <br />
            <br />
            {questions.map((question, questionIndex) => (
                <div key={question.id || questionIndex} className="create-question">
                    <h4>Typ</h4>
                    <select onChange={(e) => handleQuestionTypes(questionIndex, e.target.value)} value={question.QuestionType.name} className="select-type">
                        <option>Single Choice</option>
                        <option>Multiple Choice</option>
                        <option>Weighted Choice</option>
                    </select>
                    <br />
                    <div className="question-input">
                        <input
                        type="text"
                        placeholder={`Question ${questionIndex + 1}`}
                        value={question.name}
                        onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                        />
                        <button type="button" className="delete" onClick={() => deleteQuestion(questionIndex)}>✖</button>
                    </div>
                    <br />
                    <h4>Antworten</h4>
                    {question.Answers.map((answer, answerIndex) => (
                        <div key={answer.id || answerIndex} className="answer-input">
                            <input
                            type="text"
                            placeholder={`Answer ${answerIndex + 1}`}
                            value={answer.name}
                            onChange={(e) =>
                                handleAnswerChange(questionIndex, answerIndex, e.target.value)
                            }
                            />
                            <button type="button" className="delete" onClick={() => deleteAnswer(questionIndex, answerIndex)}>✖</button>
                        </div>
                    ))}
                    <button type="button" className="add" onClick={() => addAnswer(questionIndex)}>Antwort hinzufügen</button>
                </div>
            ))}
            <button type="button" className="add" onClick={addQuestion}>Frage hinzufügen</button>
            <br />
            <button type="submit" className="edit-button">
                {submitted ? 'Änderungen gespeichert!' : 'Änderungen speichern'}
            </button>
            </form>
        <p>{response}</p>
        </div>
    );
}

export default EditPolls;
