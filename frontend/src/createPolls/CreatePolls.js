import React, { useState } from 'react';

function CreatePoll() {
    const [poll, setPoll] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [response, setResponse] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const resP = await fetch('http://localhost:3001/api/poll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: poll }),
            });
            const dataP = await resP.json();

            const resQ = await fetch('http://localhost:3001/api/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: question, pollId: dataP.id }),
            });
            const dataQ = await resQ.json();

            const resA = await fetch('http://localhost:3001/api/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: answer }),
            });
            const dataA = await resA.json();

            if (resP.ok && resQ.ok && resA.ok) {
                setResponse(`Poll saved with ID: ${dataP.id} and question saved with ID: ${dataQ.id} and answer saved with ID: ${dataA.id}`);
                setPoll('');
                setQuestion('');
                setAnswer('');
            } else if (resP.ok && resQ.ok) {
                setResponse(`Error: ${dataA.error}`);
            } else if (resP.ok && resA.ok) {
                setResponse(`Error: ${dataQ.error}`);
            } else if (resQ.ok && resA.ok) {
                setResponse(`Error: ${dataP.error}`);
            }
        } catch (error) {
            console.error('Error submitting poll:', error);
            setResponse('Error submitting poll');
        }
    };
    return (
        <div>
        <form onSubmit={handleSubmit}>
        <label>
        Poll:
        <input
        type="text"
        value={poll}
        onChange={(e) => setPoll(e.target.value)}
        />
        </label>
        <br />
        <label>
        Question:
        <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        />
        </label>
        <br />
        <label>
        Answer:
        <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        />
        </label>
        <br /><button type="submit">Submit</button>
        </form>
        <p>{ response }</p>
        </div>
    )
}

export default CreatePoll;
