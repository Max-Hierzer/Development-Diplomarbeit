const { Polls } = require('../models/index');

async function fetchPollId() {
    try {
        const id = await Polls.max('id');
        return id;
    }
    catch (error) {
        console.error('Error fetching id in service: ', error);
        throw error;
    }
}

module.exports = { fetchPollId };
