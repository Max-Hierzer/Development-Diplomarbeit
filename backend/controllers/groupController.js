const { fetchGroups, fetchGroupUsers, editGroups } = require('../services/groupServices');

async function handleFetchGroups(req, res) {
    try {
        const groups = await fetchGroups()
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups in Controller: ', error)
        res.status(500).json({error: 'Error fetching groups: ', error})
    }
}

async function handleFetchGroupUsers(req, res) {
    try {
        const users = await fetchGroupUsers(req.params.id);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users in Controller: ', error)
        res.status(500).json({error: 'Error fetching users: ', error})
    }
}

async function handleEditGroups(req, res) {
    try {
        const updatedGroup = await editGroups(req.body);
        res.json(updatedGroup);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleFetchGroups,
    handleFetchGroupUsers,
    handleEditGroups
}
