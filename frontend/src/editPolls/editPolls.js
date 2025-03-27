import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
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
    const [allGroups, setAllGroups] = useState([]);
    const [pollGroups, setPollGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedGroupsDel, setSelectedGroupsDel] = useState([]);
    const [publicQuestions, setPublicQuestions] = useState([]);
    const [selectedPublicQuestions, setSelectedPublicQuestions] = useState([]);
    const [existingPublicQuestions, setExistingPublicQuestions] = useState([]);

    console.log(publicQuestions)

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
            setPublicQuestions(
                (selectedPoll.publicPollQuestions || []).map((publicPoll) => ({
                    id: publicPoll.PublicQuestion.id,
                    name: publicPoll.PublicQuestion.name,
                    typeId: publicPoll.PublicQuestion.typeId,
                    questionType: publicPoll.PublicQuestion.QuestionType.name, // e.g., 'Single Choice'
                    PublicAnswers: publicPoll.PublicQuestion.PublicAnswers.map((answer) => ({
                        id: answer.id,
                        name: answer.name,
                    }))
                }))
            );
        }
    }, [selectedPoll]);

    const addQuestion = () => {
        setQuestions([...questions, { id: null, name: '', QuestionType: { name: 'Single Choice'}, Answers: [{ name: '' }, { name: '' }] }]);
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
            setPublicQuestions(newType);
        }
        else {
            const newType = [...questions];
            newType[questionIndex].type = value;
            setQuestions(newType);
        }
    }

    useEffect(() => {
        const handlePublicQuestionChange = () => {
            const newPublicQuestions = [
                ...publicQuestions,
                ...selectedPublicQuestions.map(selected => selected.question)
                .filter(newQuestion =>
                !publicQuestions.some(existingQuestion => existingQuestion.id === newQuestion.id)
                )
            ];
            setPublicQuestions(newPublicQuestions);
        };

        handlePublicQuestionChange();
    }, [selectedPublicQuestions]);

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
                if (selectedGroups.length > 0) {
                    const groupIds = selectedGroups.map(group => group.value);
                    const addGroupsResponse = await fetch('http://localhost:3001/groups/polls', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pollId: selectedPoll.id,
                            groupIds: groupIds
                        }),
                    });


                    if (addGroupsResponse.ok) {
                        console.log('Groups added successfully');
                        // Update the group users list with the newly added users
                        setPollGroups(prevGroups => [
                            ...prevGroups,
                            ...selectedGroups.map(group => ({
                                id: group.value,
                                name: group.label
                            }))
                        ]);
                        setSelectedGroups([]); // Clear the selected users after adding them
                    } else {
                        console.log('Failed to add users');
                    }
                }
                if (selectedGroupsDel.length > 0) {
                    const groupIdsDel = selectedGroupsDel.map(user => user.value);
                    const delGroupsResponse = await fetch(`http://localhost:3001/groups/polls`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            pollId: selectedPoll.id,
                            groupIds: groupIdsDel,
                        }),
                    });

                    if (delGroupsResponse.ok) {
                        console.log('User removed from group successfully');
                        setPollGroups(prevGroups => prevGroups.filter(group => !groupIdsDel.includes(group.id)));
                        setSelectedGroupsDel([]);
                    } else {
                        console.error('Failed to remove user from group');
                    }
                }

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

    useEffect(() => {
        const handleFetchGroups = async () => {
            try {
                const response = await fetch('http://localhost:3001/groups');
                if (response.ok) {
                    const data = await response.json();
                    setAllGroups(data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        handleFetchGroups();
    }, []);

    useEffect(() => {
        const handleFetchPollGroups = async (pollId) => {
            try {
                const response = await fetch(`http://localhost:3001/groups/polls/${pollId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPollGroups(data);
                }
            } catch (error) {
                console.error(error);
            }
        };
        handleFetchPollGroups(selectedPoll.id);
    }, [selectedPoll]);

    const availableGroups = allGroups.filter(group =>
    !pollGroups.some(pollGroup => pollGroup.id === group.id)
    );

    useEffect(() => {
        const fetchAllPublicQuestions = async () => {
            try {
                const response = await fetch('http://localhost:3001/public/all');
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
                <h4>Gruppen hinzufügen</h4>
                <Select
                    className="select-groups"
                    isMulti
                    value={selectedGroups}
                    options={availableGroups.map(group => ({ value: group.id, label: group.name }))}
                    onChange={(selectedOptions) => setSelectedGroups(selectedOptions)}
                    placeholder="Suche nach Gruppen"
                />
                <br/>
                <br/>

                <h4>Gruppen entfernen</h4>
                <Select
                    className="select-groups"
                    isMulti
                    value={selectedGroupsDel}
                    options={pollGroups.map(group => ({ value: group.id, label: group.name }))}
                    onChange={(selectedOptions) => setSelectedGroupsDel(selectedOptions)}
                    placeholder="Suche nach Gruppen"
                />
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
            <br />
            {isPublic === "Ja" && (
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

                { publicQuestions.map((question, questionIndex) => (
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
                        <button type="button" className="delete" onClick={() => deleteQuestion(questionIndex)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
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
                            <button type="button" className="delete" onClick={() => deleteAnswer(questionIndex, answerIndex)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
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
