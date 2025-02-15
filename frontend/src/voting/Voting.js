import ImportanceScale from '../voting/ImportanceScale';
import '../styles/voting.css';

const Voting = ({ selectedPoll, selectedAnswers, handleAnswerChange, handleImportanceChange }) => {
    return (
        <div className="vote-container">
            <h2><span>{selectedPoll.name}</span></h2>
            {selectedPoll.description && (
                <div>
                    <h4 className='description-header'>Beschreibung: </h4>
                    <h5 className='description'>{selectedPoll.description}</h5>
                </div>
            )}
            <br />
            {selectedPoll.Questions &&
                selectedPoll.Questions.map((question) => {
                    const isMultipleChoice = question.QuestionType.name === "Multiple Choice";

                    return (
                        <div key={question.id} className="question">
                            <h3 className="question-header">
                                <span className="question-text">{question.name}</span>
                                <span className="question-type">{question.QuestionType.name}</span>
                            </h3>
                            {question.Answers &&
                                question.Answers.map((answer) => (
                                    <div key={answer.id} className="answer">
                                            <input
                                                type={isMultipleChoice ? "checkbox" : "radio"}
                                                name={`question-${question.id}`}
                                                value={answer.id}
                                                checked={
                                                    isMultipleChoice
                                                        ? !!selectedAnswers[question.id]?.answer?.includes(answer.id)
                                                        : selectedAnswers[question.id]?.answer?.[0] === answer.id
                                                }
                                                onChange={(event) =>
                                                    handleAnswerChange(question.id, answer.id, isMultipleChoice, event.target.checked)
                                                }
                                            />
                                        <label>{answer.name}</label>
                                    </div>
                                ))}

                            {question.QuestionType.name === "Weighted Choice" && (
                                <ImportanceScale
                                    questionId={question.id}
                                    onImportanceChange={handleImportanceChange}
                                />
                            )}
                        </div>
                    );
                })}
        </div>
    );
};
export default Voting;
