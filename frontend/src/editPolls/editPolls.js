//import React, { useState } from 'react';

function EditPolls({selectedPoll}) {
    function handleSubmit(event){
        event.preventDefault();
        console.log("Hallo")
    }
    return (
        <div>
        { selectedPoll.id ? (
        <form onSubmit={(event) => handleSubmit(event)}>
        <h1>Pollname</h1>
        <input defaultValue={selectedPoll.name}/>
        {selectedPoll.Questions && selectedPoll.Questions.map((question) => (
            <div key={question.id} className="Question">
            <h2>Question</h2>
            <input defaultValue={question.name} />
            <h3>Answers</h3>
            {
                question.Answers && question.Answers.map((answer) => (
                    <div key={answer.id} className="Answer">
                    <input defaultValue={answer.name} />
                    </div>
                ))
            }
            </div>
        ))}
        <button type="submit">Submit Change</button>
        </form>
        ) : null}
        </div>
    );
}

export default EditPolls;
