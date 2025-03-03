const { Users, Roles, UserAnswers } = require('../models/index');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
require('dotenv').config();

// writing new user data in database
async function createUser(name, email, password, roleId) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await Users.create({ name, email, password: hashedPassword, roleId }); // creates new user with attributes name, email, password
        return user;
    } catch (error) {
        console.error('Error creating user in service:', error);
        throw error;
    }
}

async function fetchUsers(pollId, questions) {
    try {
        const userVotes = {};

        for (const question of questions) {
            for (const answer of question.Answers) {
                const userIds = await UserAnswers.findAll({
                    where: { questionId: question.id, answerId: answer.id },
                    attributes: ['userId']
                });

                if (!userVotes[answer.id]) {
                    userVotes[answer.id] = [];
                }

                for (const user of userIds) {
                    const username = await Users.findOne({
                        where: { id: user.userId },
                        attributes: ['name']
                    });

                    if (username && username.name) {  // ✅ Ensure valid username
                        userVotes[answer.id].push(username.name);
                    }
                }
            }
        }
        return userVotes;
    } catch (error) {
        console.error('Error fetching users in service:', error);
        throw error;
    }
}

// getting login data from database
async function fetchLogin(username, password) {
    try {
        const user = await Users.findOne({
            where: {name: username},
            include: [{ model: Roles, attributes: ['id', 'name'] }]
        });

        if (!user) {
            return { success: false, message: "Invalid username or password" };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return { success: false, message: "Invalid username or password" };
        }

        return {
            success: true,
            userId: user.id,
            username: user.name,
            roleId: user.roleId,
            roleName: user.Role.name
        };
    } catch (error) {
        console.error('Error fetching user in service:', error);
        throw error;
    }
}

async function sendEmail(firstName, lastName, email) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
    });

    const hash = encodeURIComponent(btoa(`public=${poll.public}&mode=vote&poll=${poll.id}&anonymous=${poll.anonymous}`));

    const registrationUrl = "http://localhost:3000" + hash;
    const roleName = "temp";

    let mailOptions = {
        from: `"LMP" <${process.env.USER_EMAIL}>`,
        to: email,
        subject: "Deine Einladung zur Registrierung beim LMP Umfragetool",
        text: `Hallo ${firstName} ${lastName},\n\n
du wurdest von einem Administrator eingeladen, dich beim LMP Umfragetool zu registrieren.
Über den folgenden Link kannst du dein Passwort setzen und deine Registrierung abschließen:\n\n
🔗 ${registrationUrl}\n\n
Deine zugewiesene Rolle: ${roleName}\n\n
Falls du diese Einladung nicht erwartet hast, kannst du diese E-Mail ignorieren.
Bei Fragen kannst du uns unter lmp.support@example.com erreichen.\n\n
Viele Grüße,\n
Das LMP-Team`
    };

    try {
        let info = await transporter.sendMail(mailOptions);

        if (!info) {
            return { message: "Error while sending email." };
        }

        console.log("E-Mail gesendet: " + info.response);

        return {
            success: true
        };
    } catch (error) {
        console.error("Fehler beim Senden der E-Mail:", error);
}
}

module.exports = {
    createUser: createUser,
    fetchUsers: fetchUsers,
    fetchLogin: fetchLogin,
    sendEmail: sendEmail
};
