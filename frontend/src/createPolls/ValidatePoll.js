import React from 'react';

const PollValidators = {

    validatePollData(poll, publishDate, endDate, questions) {
        if (!poll) return `Poll name is required`;
        if (!publishDate) return `Publish date is required`;
        if (!endDate) return `End date is required`;

        for (const question of questions) {
            if (!question.name) return `Question text is required`;

            const seenAnswers = new Set();
            for (const answer of question.answers) {
                if (!answer.name) return `Answer text in Question "${question.name}" is required`;
                if (seenAnswers.has(answer.name)) {
                    return `Duplicate Answer "${answer.name}" in Question "${question.name}"`;
                }
                seenAnswers.add(answer.name);
            }
        }
        return null;
    }
};

export default PollValidators;
