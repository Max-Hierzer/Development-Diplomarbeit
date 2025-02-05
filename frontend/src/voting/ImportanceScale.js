import { useState } from 'react';

const ImportanceScale = ({ questionId, onImportanceChange }) => {
    const [importance, setImportance] = useState(null);
    const scaleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const handleSelectImportance = (value) => {
        setImportance(value);
        onImportanceChange(questionId, value);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "-10px" }}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "3px",
                fontSize: "12px"
            }}>
                {/*<span style={{ fontSize: "12px", fontWeight: "bold", color: "#888" }}>Not <br />Important</span>*/}

                {scaleValues.map((value) => (
                    <button
                        key={value}
                        onClick={() => handleSelectImportance(value)}
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            backgroundColor: importance === value ? "#D55C27" : "#EAEAEA",
                            color: importance === value ? "#fff" : "#333",
                            fontSize: "12px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            outline: "none",
                            padding: "5px"
                        }}
                    >
                        {value}
                    </button>
                ))}

                {/*<span style={{ fontSize: "12px", fontWeight: "bold", color: "#888" }}>Important</span>*/}
            </div>
        </div>
    );
};

export default ImportanceScale;
