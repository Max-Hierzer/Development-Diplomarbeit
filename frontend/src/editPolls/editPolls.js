//import React, { useState } from 'react';

function EditPolls({selectedPoll, polls}) {
    const poll = polls.filter((poll) => poll.id.toString() === selectedPoll)[0];
    console.log(poll)
    return (
        <div>
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
        </div>
    )
}

export default EditPolls;
