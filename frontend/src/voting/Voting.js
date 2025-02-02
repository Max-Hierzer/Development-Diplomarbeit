import '../styles/voting.css';

function Voting({ question, answer, selectedAnswers, handleAnswerChange }) {



    return (
        <div >
            <label className="answer" key={answer.id}>
                <input
                    type="radio"
                    name={`question-${question.id}`} // Unique name for each question
                    value={answer.id}
                    checked={selectedAnswers[question.id]?.answerId === answer.id}
                    onChange={() => handleAnswerChange(question.id, answer.id)} // Update selected answer for this question
                    key={answer.id}
                />
                <span>{answer.name}</span>
            </label>
        </div>
    );
}

export default Voting;
