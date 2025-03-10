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

async function fetchUsers() {
    try {
        const users = await Users.findAll();
        return users;
    }
}

async function fetchGroupUsers(groupId) {
    try {
        const groupUsers = await UserGroups.findAll({
            where: { groupId: groupId },
            include: [
                {
                    model: Users,
                }
            ]
        });
        const users = groupUsers.map(ug => ug.User);

        return users;
    } catch (error) {
        console.error('Error fetching group users:', error);
        throw error;
    }
}

async function editGroups(data) {
        const group = await Groups.findByPk(data.id);
        if (!group) throw new Error('Group not found');

        await Groups.update({ name: data.name, description: data.description }, { where: { id: data.id } });

        return { message: 'Group updated successfully' };
    }

module.exports = {
    fetchGroups,
    fetchGroupUsers,
    editGroups
};
