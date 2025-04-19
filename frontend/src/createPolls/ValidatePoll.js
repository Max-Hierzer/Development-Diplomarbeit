import React from 'react';

const PollValidators = {

    validatePollData(poll, publishDate, endDate, questions) {
        if (!poll) return `Poll name is required`;
        if (!publishDate) return `Publish date is required`;
        if (!endDate) return `End date is required`;

        for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
            if (!questions[questionIndex].name) return `Question ${questionIndex + 1} requires text`;
            for (let answerIndex = 0; answerIndex < questions[questionIndex].answers.length; answerIndex++) {
                console.log(questions[questionIndex]);
                if (!questions[questionIndex].answers[answerIndex].name) return `Answer ${answerIndex + 1} in Question ${questionIndex + 1} requires text`;
            }
        }
        return null;
    }
};

export default PollValidators;
