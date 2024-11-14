const { Polls: Poll } = require('../models');

async function createPoll(name) {
    try {
        const poll = await Poll.create({ name });
        return poll;
    } catch (error) {
        console.error('Error creating poll in service:', error);
        throw error;
    }
}

/*async function fetchPolls() {
    try {
        const polls = await Poll.findAll();
        return polls;
    } catch (error) {
        console.error('Error fetching polls in service:', error);
        throw error;
    }

}*/

module.exports = {
    createPoll: createPoll
};
