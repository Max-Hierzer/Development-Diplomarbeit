import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import PollValidators from './ValidatePoll';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/create.css';

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
    const [selectedPublic, setSelectedPublic] = useState('Nein');
    const [selectedAnon, setSelectedAnon] = useState('Ja');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) return; 

        const previewUrl = URL.createObjectURL(file);
        setImage(previewUrl);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch('http://localhost:3001/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setImageUrl(data.imageUrl); 
            } else {
                setResponse('Error uploading image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setResponse('Error uploading image');
        }
    };



    const handleSubmit = async (event) => {
        event.preventDefault();

        let isPublic = selectedPublic === "Ja";
        let isAnon = selectedAnon === "Ja";

        const payload = {
            poll: {
                name: poll,
                description: description,
                userId: sessionStorage.getItem('userId'),
                public: isPublic,
                anon: isAnon,
                publishDate: publishDate,
                endDate: endDate,
                imageUrl: imageUrl, // Include image URL in the payload
            },
            questions,
            selectedGroups
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
                setSelectedPublic('Nein');
                setSelectedAnon('Ja');
                setImage(null); // Clear the image state after submission
                setImageUrl(''); // Clear the image URL
                setSelectedGroups([]);
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


    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('http://localhost:3001/groups');
                if (response.ok) {
                    const data = await response.json();
                    setGroups(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchGroups();
    }, []);

    return (
        <div className="create-content">
            <form onSubmit={handleSubmit} className="create-form">
                <h1>Erstellen</h1>
                <label htmlFor="name" className="hidden-label">Umfragetitel</label>
                <input
                    id="name"
                    type="text"
                    placeholder={`Name`}
                    value={poll}
                    onChange={(e) => setPoll(e.target.value)}
                />
                <br />
                <label htmlFor="beschreibung" className="hidden-label">Beschreibung</label>
                <textarea
                    id="beschreibung"
                    placeholder="Beschreibung"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5} // Adjust the number of rows for the desired height
                    cols={50} // Adjust the number of columns for the desired width
                    style={{ resize: 'vertical' }} // Optional: Allow resizing vertically only
                    className="description"
                />
                <br />
                <br />
                <h4>Öffentlich</h4>
                <label htmlFor="public" className="hidden-label">Soll die Umfrage öffentlich sein?</label>
                <select id="public" onChange={(e) => setSelectedPublic(e.target.value)} value={selectedPublic} className="select-public">
                    <option>Nein</option>
                    <option>Ja</option>
                </select>
                <br />
                <br />
                {selectedPublic === "Nein" && (
                    <div>
                        <h4>Anonym</h4>
                        <label htmlFor="anon" className="hidden-label">Soll die Umfrage anonym sein?</label>
                        <select id="anon" onChange={(e) => setSelectedAnon(e.target.value)} value={selectedAnon} className="select-anon">
                            <option>Ja</option>
                            <option>Nein</option>
                        </select>
                        <br />
                        <br />
                        <h4>Gruppen hinzufügen</h4>
                        <Select
                            className="select-groups"
                            isMulti
                            value={selectedGroups}
                            options={groups.map(group => ({ value: group.id, label: group.name }))}
                            onChange={(selectedOptions) => setSelectedGroups(selectedOptions)}
                            placeholder="Suche nach Gruppen"
                        />
                        <br />
                        <br />
                    </div>
                )}
                <div className="datetime-container">
                    <label htmlFor="start-time" className="hidden-label">Wann soll die Umfrage starten?</label>
                    <Datetime
                        id="start-time"
                        key={`publish-${resetKey}`}
                        value={publishDate}
                        onChange={(date) => setPublishDate(date)}
                        dateFormat="DD/MM/YYYY"
                        timeFormat="HH:mm"
                        closeOnSelect={true}
                        inputProps={{ placeholder: "Startzeitpunkt" }}
                    />
                    <label htmlFor="end-time" className="hidden-label">Wann soll die Umfrage enden?</label>
                    <Datetime
                        id="end-time"
                        key={`end-${resetKey}`}
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="DD/MM/YYYY"
                        timeFormat="HH:mm"
                        closeOnSelect={true}
                        inputProps={{ placeholder: "Endzeitpunkt" }}
                    />
                </div>
                <br />
                <br />
                <label htmlFor="image-upload" className="hidden-label">Fügen Sie ein Bild hinzu</label>
                <input
                    type="file"
                    id="image-upload"
                    onChange={handleImageUpload}
                    accept="image/*" 
                />
                <br />

                {image && (
                    <div className="image-preview">
                        <img src={image} alt="Preview" style={{ width: '200px', height: 'auto', marginTop: '10px', borderRadius: '10px' }} />
                    </div>
                )}
                <br />

                {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="create-question">
                        <h4>Fragentyp</h4>
                        <label htmlFor="question-type" className="hidden-label">Was für einen Typ soll Frage {questionIndex + 1} haben?</label>
                        <select id="question-type" onChange={(e) => handleQuestionTypes(questionIndex, e.target.value)} value={question.type} className="select-type">
                            <option>Single Choice</option>
                            <option>Multiple Choice</option>
                            <option>Weighted Choice</option>
                        </select>
                        <label htmlFor="question-text" className="hidden-label">Wie soll Frage {questionIndex + 1} lauten?</label>
                        <div className="question-input">
                            <input
                                id="question-text"
                                type="text"
                                placeholder={`Frage ${questionIndex + 1}`}
                                value={question.name}
                                onChange={(e) =>
                                    handleQuestionChange(questionIndex, e.target.value)
                                }
                            /><button type="button" className="delete" onClick={() => deleteQuestion(questionIndex)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <br />
                        <h4>Antworten</h4>
                        {question.answers.map((answer, answerIndex) => (
                            <div key={answerIndex} className="answer-input">
                                <label htmlFor="answer-text" className="hidden-label">Wie soll Antwort {answerIndex + 1} zu {questionIndex + 1} lauten?</label>
                                <input
                                    id="answer-text"
                                    type="text"
                                    placeholder={`Antwort ${answerIndex + 1}`}
                                    value={answer.name}
                                    onChange={(e) =>
                                        handleAnswerChange(questionIndex, answerIndex, e.target.value)
                                    }
                                /><button type="button" className="delete" onClick={() => deleteAnswer(questionIndex, answerIndex)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="add" onClick={() => addAnswer(questionIndex)}>Antwort hinzufügen</button>
                    </div>
                ))}
                <button type="button" className="add" onClick={addQuestion}>Frage hinzufügen</button>

                <br />
                <button type="submit" className="create-button">Umfrage erstellen</button>
            </form>
            <p>{response}</p>
        </div>
    );
}

export default CreatePoll;
