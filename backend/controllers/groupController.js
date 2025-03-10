const { fetchGroups, fetchUsers, fetchGroupUsers, editGroups, addUsersToGroup, removeUser } = require('../services/groupServices');

async function handleFetchGroups(req, res) {
    try {
        const groups = await fetchGroups()
        res.status(200).json(groups);
    } catch (error) {
        console.error('Error fetching groups in Controller: ', error)
        res.status(500).json({error: 'Error fetching groups: ', error})
    }
}

async function handleFetchUsers(req, res) {
    try {
        const users = await fetchUsers();
        res.status(200).json(users);
    } catch {
        console.error("Error fetching users in controller: ", error);
        res.status(500).json({error: "Error fetching users: ", error});
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

async function handleAddUsersToGroup(req, res) {
    const { groupId, userIds } = req.body; // Expecting { groupId, userIds: [1, 2, 3] }

    try {
        const result = await addUsersToGroup(groupId, userIds);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error adding users to group:', error);
        res.status(500).json({ error: 'Error adding users to group', details: error.message });
    }
}

async function handleRemoveUser(req, res) {
    const { groupId, userId } = req.body;

    try {
        const result = await removeUser(groupId, userId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error removing user from group:', error);
        res.status(500).json({ error: 'Error removing user from group', details: error.message });
    }
}



module.exports = {
    handleFetchGroups,
    handleFetchUsers,
    handleFetchGroupUsers,
    handleEditGroups,
    handleAddUsersToGroup,
    handleRemoveUser
}
