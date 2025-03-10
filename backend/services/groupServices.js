const { Groups, Users, UserGroups } = require('../models');


//Fetch all groups
async function fetchGroups() {
    try {
        const groups = await Groups.findAll()
        return groups;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
}

module.exports = {
    fetchGroups
};
