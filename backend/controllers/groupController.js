const { fetchGroups, editGroups } = require('../services/groupServices');

async function handleFetchGroups(req, res) {
    try {
        const groups = await fetchGroups()
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching results in Controller: ', error)
        res.status(500).json({error: 'Error fetching groups: ', error})
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
    handleEditGroups
}
