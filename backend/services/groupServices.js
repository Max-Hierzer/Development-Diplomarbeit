const { Groups, Users, UserGroups, PollGroups, Polls } = require('../models');


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
    } catch (error) {
        console.error("Error fetching users: ", error);
        throw error;
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

async function addUsersToGroup(groupId, userIds) {
    try {
        // Validate the group exists
        const group = await Groups.findByPk(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        // Add users to the group (ensure no duplicates)
        const promises = userIds.map(async (userId) => {
            const user = await Users.findByPk(userId);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }

            // Check if the user is already in the group
            const existingUserGroup = await UserGroups.findOne({
                where: { groupId, userId }
            });
            if (!existingUserGroup) {
                // Add the user to the group
                await UserGroups.create({ groupId, userId });
            }
        });

        // Wait for all promises to complete
        await Promise.all(promises);

        return { message: 'Users added to group successfully' };
    } catch (error) {
        console.error('Error adding users to group:', error);
        throw error;
    }
}

async function removeUser(groupId, userId) {
    try {
        // Check if the group exists
        const group = await Groups.findByPk(groupId);
        if (!group) {
            throw new Error('Group not found');
        }

        // Check if the user exists
        const user = await Users.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Remove the user from the group by deleting the UserGroups entry
        const userGroup = await UserGroups.findOne({ where: { groupId, userId } });
        if (!userGroup) {
            throw new Error('User is not in the group');
        }

        await userGroup.destroy();  // Remove the user from the group

        return { message: 'User removed from group successfully' };
    } catch (error) {
        console.error('Error removing user from group:', error);
        throw error;
    }
}

async function createGroup(data) {
    try {
        const newGroup = await Groups.create({
            name: data.name,
            description: data.description,
        });

        return newGroup;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
}

async function deleteGroup(groupId) {
    try {
        // Check if the group exists
        const group = await Groups.findByPk(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const userGroup = await UserGroups.findByPk(groupId);
        if (userGroup) {
            await UserGroups.destroy( {where: {groupId}} );
        }
        await Groups.destroy( {where: {id: groupId}} );
        return { message: 'Group deleted successfully' };
    } catch (error) {
        console.error('Error removing user from group:', error);
        throw error;
    }
}

async function fetchPollGroups(pollId) {
    try {
        const pollGroups = await PollGroups.findAll({
            where: { pollId: pollId },
            include: [
                {
                    model: Groups,
                }
            ]
        });
        const groups = pollGroups.map(pg => pg.Group);

        return groups;
    } catch (error) {
        console.error('Error fetching group users:', error);
        throw error;
    }
}

async function addPollGroups(groupIds, pollId) {
    try {
        // Validate the group exists
        const poll = await Polls.findByPk(pollId);
        if (!poll) {
            throw new Error('Poll not found');
        }

        // Add users to the group (ensure no duplicates)
        const promises = groupIds.map(async (groupId) => {
            const group = await Groups.findByPk(groupId);
            if (!group) {
                throw new Error(`Group with ID ${groupId} not found`);
            }

            // Check if the user is already in the group
            const existingPollGroup = await PollGroups.findOne({
                where: { groupId, pollId }
            });
            if (!existingPollGroup) {
                // Add the user to the group
                await PollGroups.create({ groupId, pollId });
            }
        });

        // Wait for all promises to complete
        await Promise.all(promises);

        return { message: 'Groups added to poll successfully' };
    } catch (error) {
        console.error('Error adding group to poll:', error);
        throw error;
    }
}


module.exports = {
    fetchGroups,
    fetchUsers,
    fetchGroupUsers,
    editGroups,
    addUsersToGroup,
    removeUser,
    createGroup,
    deleteGroup,
    fetchPollGroups,
    addPollGroups
};
