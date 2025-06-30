import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import PollValidators from './ValidatePoll';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/create.css';
import CustomTooltips from "./Tooltips";


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
    const [publicQuestions, setPublicQuestions] = useState([]);
    const [selectedPublicQuestions, setSelectedPublicQuestions] = useState([]);
    const [existingPublicQuestions, setExistingPublicQuestions] = useState([]);


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];

        if (!file) return; 

        const previewUrl = URL.createObjectURL(file);
        setImage(previewUrl);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/upload-image`, {
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
            publicQuestions,
            selectedGroups
        };

        console.log(JSON.stringify(payload, null, 2));

        const error = PollValidators.validatePollData(poll, publishDate, endDate, questions);
        if (error) {
            setResponse(error);
            return;
        }
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/poll`, {
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
                setPublicQuestions([]);
                setSelectedPublicQuestions([]);
                const fileInput = document.getElementById("image-upload");
                if (fileInput) {
                    fileInput.value = "";
                }
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

    const addPublicQuestion = () => {
            const newQuestions = [...publicQuestions];
            newQuestions.push({ name: '', typeId: 1, PublicAnswers: [{ name: '' }, { name: '' }] });
            setPublicQuestions(newQuestions);
    };

    const addAnswer = (questionIndex, isPublic = false) => {
        if (isPublic) {
            const newQuestions = [...publicQuestions];
            newQuestions[questionIndex].PublicAnswers.push({ name: '' });
            setPublicQuestions(newQuestions);
        }
        else {
            const newQuestions = [...questions];
            newQuestions[questionIndex].answers.push({ name: '' });
            setQuestions(newQuestions);
        }
    };

    const deleteQuestion = (questionIndex, isPublic = false) => {
        if (isPublic) {
            const questionToDelete = publicQuestions[questionIndex];
            const newQuestions = [...publicQuestions];
            newQuestions.splice(questionIndex, 1);
            setPublicQuestions(newQuestions);

            setSelectedPublicQuestions(prevSelected =>
            prevSelected.filter(q => q.value !== questionToDelete.id)
            );
        }
        else {
            const newQuestions = [...questions];
            newQuestions.splice(questionIndex, 1);
            setQuestions(newQuestions);
        }
    };

    const deleteAnswer = (questionIndex, answerIndex, isPublic = false) => {
        if (isPublic) {
            const newQuestions = [...publicQuestions];
            newQuestions[questionIndex].PublicAnswers.splice(answerIndex, 1);
            setPublicQuestions(newQuestions);
        }
        else {
            const newQuestions = [...questions];
            newQuestions[questionIndex].answers.splice(answerIndex, 1);
            setQuestions(newQuestions);
        }
    };

    const handleQuestionChange = (index, value, isPublic = false) => {

        if (isPublic) {
            const newQuestions = [...publicQuestions];
            newQuestions[index].name = value;
            setPublicQuestions(newQuestions);
        }
        else {
            const newQuestions = [...questions];
            newQuestions[index].name = value;
            setQuestions(newQuestions);
        }
    };

    const handleAnswerChange = (questionIndex, answerIndex, value, isPublic = false) => {
        if (isPublic) {
            const newQuestions = [...publicQuestions];
            newQuestions[questionIndex].PublicAnswers[answerIndex].name = value;
            setPublicQuestions(newQuestions);
        }
        else {
            const newQuestions = [...questions];
            newQuestions[questionIndex].answers[answerIndex].name = value;
            setQuestions(newQuestions);
        }
    };

    const handleQuestionTypes = (questionIndex, value, isPublic = false) => {
        if (isPublic) {
            const newType = [...publicQuestions];
            newType[questionIndex].type = value;
            newType[questionIndex].typeId = value === "Multiple Choice" ? 2 : value === "SingleChoice" ? 1 : newType[questionIndex].typeId;
            setPublicQuestions(newType);
        }
        else {
            const newType = [...questions];
            newType[questionIndex].type = value;
            setQuestions(newType);
        }
    }


    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/groups`);
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

    useEffect(() => {
        const fetchAllPublicQuestions = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/public/all`);
                if (response.ok) {
                    const data = await response.json();
                    setExistingPublicQuestions(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllPublicQuestions();
    }, [])

    useEffect(() => {
        const handlePublicQuestionChange = () => {
            const newPublicQuestions = [
                ...selectedPublicQuestions
                .filter(q => !publicQuestions.some(pq => pq.id === q.value)) // Only add if not already in the array
                .map(q => q.question),
              ...publicQuestions
            ];
            setPublicQuestions(newPublicQuestions);
        };

        handlePublicQuestionChange();
    }, [selectedPublicQuestions]);

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
                    data-tooltip-id="poll-name-tooltip"
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
                    data-tooltip-id="description-tooltip"
                />
                <br />
                <br />
                <h4>Öffentlich</h4>
                <label htmlFor="public" className="hidden-label">Soll die Umfrage öffentlich sein?</label>
                <select id="public" onChange={(e) => setSelectedPublic(e.target.value)} value={selectedPublic} className="select-public" data-tooltip-id="public-tooltip">
                    <option>Nein</option>
                    <option>Ja</option>
                </select>
                <br />
                <br />
                {selectedPublic === "Nein" && (
                    <div>
                        <h4>Anonym</h4>
                        <label htmlFor="anon" className="hidden-label">Soll die Umfrage anonym sein?</label>
                        <select id="anon" onChange={(e) => setSelectedAnon(e.target.value)} value={selectedAnon} className="select-anon" data-tooltip-id="anonym-tooltip">
                            <option>Ja</option>
                            <option>Nein</option>
                        </select>
                        <br />
                        <br />
                        <h4>Gruppen hinzufügen</h4>
                        <div data-tooltip-id="group-tooltip"><Select
                            className="select-groups"
                            isMulti
                            value={selectedGroups}
                            options={groups.map(group => ({ value: group.id, label: group.name }))}
                            onChange={(selectedOptions) => setSelectedGroups(selectedOptions)}
                            placeholder="Suche nach Gruppen"
                            data-tooltip-id="group-tooltip"
                        />
                        </div>
                        <br />
                        <br />
                    </div>
                )}
                <div className="datetime-container" >
                    <label htmlFor="start-time" className="hidden-label">Wann soll die Umfrage starten?</label>
                    <div data-tooltip-id="start-tooltip"><Datetime
                        id="start-time"
                        key={`publish-${resetKey}`}
                        value={publishDate}
                        onChange={(date) => setPublishDate(date)}
                        dateFormat="DD/MM/YYYY"
                        timeFormat="HH:mm"
                        closeOnSelect={true}
                        inputProps={{ placeholder: "Startzeitpunkt" }}
                    />
                    </div>
                    <label htmlFor="end-time" className="hidden-label">Wann soll die Umfrage enden?</label>
                    <div data-tooltip-id="end-tooltip"><Datetime
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
                </div>
                <br />
                <br />
                <label htmlFor="image-upload" className="hidden-label">Fügen Sie ein Bild hinzu</label>
                <div data-tooltip-id="image-tooltip"><input
                    type="file"
                    id="image-upload"
                    onChange={handleImageUpload}
                    accept="image/*" 
                /></div>
                <br />

                {image && (
                    <div className="image-preview">
                        <img src={image} alt="Preview" style={{ width: '200px', height: 'auto', marginTop: '10px', borderRadius: '10px' }} />
                    </div>
                )}
                <br />
                {selectedPublic === "Ja" && (
                    <div>
                    <h2>Demografische Fragen</h2>
                    <Select
                    className="select-publicQuestions"
                    isMulti
                    value={selectedPublicQuestions}
                    options={existingPublicQuestions.map(question => ({ value: question.id, label: question.name, question: question }))}
                    onChange={(selectedOptions) => setSelectedPublicQuestions(selectedOptions)}
                    placeholder="Suche nach Fragen"
                    />
                    <br />
                    <br />

                    {publicQuestions.map((question, questionIndex) => (
                        <div key={questionIndex} className="create-question">
                        <h4>Fragentyp</h4>
                        <label htmlFor={`public-question-type-${questionIndex}`} className="hidden-label">
                        Was für einen Typ soll Frage {questionIndex + 1} haben?
                        </label>
                        <select
                        id={`public-question-type-${questionIndex}`}
                        onChange={(e) => handleQuestionTypes(questionIndex, e.target.value, true)}
                        value={question.type}
                        className="select-type"
                        >
                        <option>Single Choice</option>
                        <option>Multiple Choice</option>
                        </select>
                        <label htmlFor={`public-question-text-${questionIndex}`} className="hidden-label">
                        Wie soll Frage {questionIndex + 1} lauten?
                        </label>
                        <div className="question-input">
                        <input
                        id={`public-question-text-${questionIndex}`}
                        type="text"
                        placeholder={`Frage ${questionIndex + 1}`}
                        value={question.name}
                        onChange={(e) => handleQuestionChange(questionIndex, e.target.value, true)}
                        />
                        <button type="button" className="delete" onClick={() => deleteQuestion(questionIndex, true)}>
                        <FontAwesomeIcon icon={faTimes} />
                        </button>
                        </div>
                        <br />
                        <h4>Antworten</h4>
                        {question.PublicAnswers.map((answer, answerIndex) => (
                            <div key={answerIndex} className="answer-input">
                            <label htmlFor={`public-answer-text-${questionIndex}-${answerIndex}`} className="hidden-label">
                            Wie soll Antwort {answerIndex + 1} zu {questionIndex + 1} lauten?
                            </label>
                            <input
                            id={`public-answer-text-${questionIndex}-${answerIndex}`}
                            type="text"
                            placeholder={`Antwort ${answerIndex + 1}`}
                            value={answer.name}
                            onChange={(e) =>
                                handleAnswerChange(questionIndex, answerIndex, e.target.value, true)
                            }
                            />
                            <button type="button" className="delete" onClick={() => deleteAnswer(questionIndex, answerIndex, true)}>
                            <FontAwesomeIcon icon={faTimes} />
                            </button>
                            </div>
                        ))}
                        <button type="button" className="add" onClick={() => addAnswer(questionIndex, true)}>Antwort hinzufügen</button>
                        </div>
                    ))}

                    <button type="button" className="add" onClick={addPublicQuestion}>Frage hinzufügen</button>
                    <br />
                    <br />
                    </div>
                )}

                <h2>Umfrage Fragen</h2>

                {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="create-question">
                        <h4>Fragentyp</h4>
                        <label htmlFor="question-type" className="hidden-label">Was für einen Typ soll Frage {questionIndex + 1} haben?</label>
                        <select id="question-type" onChange={(e) => handleQuestionTypes(questionIndex, e.target.value)} value={question.type} className="select-type" data-tooltip-id="questiontype-tooltip">
                            <option>Single Choice</option>
                            <option>Multiple Choice</option>
                            <option>Weighted Choice</option>
                        </select>
                        <label htmlFor="question-text" className="hidden-label">Wie soll Frage {questionIndex + 1} lauten?</label>
                        <div className="question-input" data-tooltip-id="question-tooltip">
                            <input
                                id="question-text"
                                type="text"
                                placeholder={`Frage ${questionIndex + 1}`}
                                value={question.name}
                                onChange={(e) =>
                                    handleQuestionChange(questionIndex, e.target.value)
                                }
                            /><button type="button" className="delete" onClick={() => deleteQuestion(questionIndex)} data-tooltip-id="question-delete-tooltip">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <br />
                        <h4>Antworten</h4>
                        {question.answers.map((answer, answerIndex) => (
                            <div key={answerIndex} className="answer-input" data-tooltip-id="answer-tooltip">
                                <label htmlFor="answer-text" className="hidden-label">Wie soll Antwort {answerIndex + 1} zu {questionIndex + 1} lauten?</label>
                                <input
                                    id="answer-text"
                                    type="text"
                                    placeholder={`Antwort ${answerIndex + 1}`}
                                    value={answer.name}
                                    onChange={(e) =>
                                        handleAnswerChange(questionIndex, answerIndex, e.target.value)
                                    }
                                /><button type="button" className="delete" onClick={() => deleteAnswer(questionIndex, answerIndex)} data-tooltip-id="answer-delete-tooltip">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        ))}
                        <button type="button" className="add" onClick={() => addAnswer(questionIndex)} data-tooltip-id="answer-add-tooltip">Antwort hinzufügen</button>
                    </div>
                ))}
                <button type="button" className="add" onClick={addQuestion} data-tooltip-id="question-add-tooltip">Frage hinzufügen</button>

                <br />
                <button type="submit" className="create-button" data-tooltip-id="submit-tooltip">Umfrage erstellen</button>
            </form>
            <p>{response}</p>
            <CustomTooltips />
        </div>
        
    );
}

export default CreatePoll;
