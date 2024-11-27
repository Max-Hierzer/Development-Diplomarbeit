//import React, { useState } from 'react';

function EditPolls({selectedPoll, polls}) {
    const poll = polls.filter((poll) => poll.id.toString() === selectedPoll)[0];
    function Hallo(event){
        event.preventDefault();
        console.log("Hallo")
    }
    return (
        <div>
        { selectedPoll ? (
        <form onSubmit={(event) => Hallo(event)}>
        <h1>Pollname</h1>
        <input value={poll.name}/>
        {poll.Questions && poll.Questions.map((question) => (
            <div key={question.id} className="Question">
            <h2>Question</h2>
            <input value ={question.name} />
            <h3>Answers</h3>
            {
                question.Answers && question.Answers.map((answer) => (
                    <div key={answer.id} className="Answer">
                    <input value={answer.name} />
                    </div>
                ))
            }
            </div>
        ))}
        <button type="submit">Submit Change</button>
        </form>
        ) : ''}
        </div>
    )
}

export default EditPolls;
