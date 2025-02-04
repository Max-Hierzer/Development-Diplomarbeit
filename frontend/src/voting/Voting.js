import '../styles/voting.css';

const Voting = ({ question, answer, selectedAnswers, handleAnswerChange }) => {
    const isMultipleChoice = question.QuestionType.name === "Multiple Choice";

    const handleChange = (event) => {
        const { checked } = event.target;
        handleAnswerChange(question.id, answer.id, isMultipleChoice, checked);
    };

    return (
        <div>
            <label>
                <input
                    type={isMultipleChoice ? "checkbox" : "radio"}
                    name={`question-${question.id}`}
                    value={answer.id}
                    checked={
                        isMultipleChoice
                            ? !!selectedAnswers[question.id]?.answer?.includes(answer.id)
                            : selectedAnswers[question.id]?.answer?.[0] === answer.id 
                    }
                    onChange={handleChange}
                    key={answer.id}
                />
                {answer.name}
            </label>
        </div>
    );
};
export default Voting;
