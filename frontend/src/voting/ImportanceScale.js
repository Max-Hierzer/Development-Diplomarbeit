import { useState } from 'react';
import '../styles/importanceScale.css';

const ImportanceScale = ({ questionId, onImportanceChange }) => {
    const [importance, setImportance] = useState(null);
    const scaleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const handleSelectImportance = (value) => {
        setImportance(value);
        onImportanceChange(questionId, value);
        console.log(value);
    };

    return (
        <div className="scale-container">
            <div className="button-container">
                {scaleValues.map((value) => (
                    <button
                        key={value}
                        onClick={() => handleSelectImportance(value)}
                        className={importance === value ? 'scale-button-selected' : 'scale-button'}
                    >
                        {value}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImportanceScale;
