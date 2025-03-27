const { Users, Roles, UserAnswers } = require('../models/index');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');
require('dotenv').config();

// writing new user data in database
async function createUser(token, name, password) {
    try {
        const user = await Users.findOne({
            where: {
                token
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Token existiert nicht' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.update({
            name,
            password: hashedPassword,
            token: null
        });

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

async function sendEmail(firstName, lastName, email, roleId, url) {
/*    let transporter = nodemailer.createTransport({
        host: "smtp.mailersend.net",
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
        socketTimeout: 10000,
        connectionTimeout: 10000
    });

    const token = crypto.randomBytes(32).toString('hex');
    const hash = encodeURIComponent(btoa(`token=${token}`));

    const registrationUrl = "https://togema.eu/?" + hash;

    const mailOptions = {
        from: `"LMP" <${process.env.USER_EMAIL}>`,
        to: email,
        subject: "Deine Einladung zur Registrierung beim LMP Umfragetool",
        text: `Hallo ${firstName} ${lastName},\n\n
du wurdest von einem Administrator eingeladen, dich beim LMP Umfragetool zu registrieren.
Über den folgenden Link kannst du dein Passwort setzen und deine Registrierung abschließen:\n\n
🔗 ${registrationUrl}\n\n
Falls du diese Einladung nicht erwartet hast, kannst du diese E-Mail ignorieren.
Bei Fragen kannst du uns unter lmp.support@example.com erreichen.\n\n
Viele Grüße,\n
Das LMP-Team`
    };
*/


    const mailerSend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY,
    });

    const token = crypto.randomBytes(32).toString('hex');
    const hash = encodeURIComponent(btoa(`token=${token}`));
    const registrationUrl = `${url}/?${hash}`;

    try {
        const checkEmail = await Users.findOne({
            where: {
                email
            }
        });

        if (checkEmail) {
            return { success: false, message: "Email existiert bereits." };
        }

/*        console.log("attempting to send email...");
        const info = await transporter.sendMail(mailOptions);
        console.log("email sent:", info);
*/

        const mailOptions = new EmailParams()
          .setFrom(new Sender(process.env.MAILERSEND_FROM_EMAIL, 'LMP Umfragetool'))
          .setTo([new Recipient(email, `${firstName} ${lastName}`)])
          .setSubject('Deine Einladung zur Registrierung beim LMP Umfragetool')
          .setText(`Hallo ${firstName} ${lastName},\n\n
du wurdest von einem Administrator eingeladen, dich beim LMP Umfragetool zu registrieren.
Über den folgenden Link kannst du dein Passwort setzen und deine Registrierung abschließen:\n\n
🔗 ${registrationUrl}\n\n
Falls du diese Einladung nicht erwartet hast, kannst du diese E-Mail ignorieren.
Bei Fragen kannst du uns unter lmp.support@example.com erreichen.\n\n
Viele Grüße,\n
Das LMP-Team`);

        const info =  await mailerSend.email.send(mailOptions);
        const user = await Users.create({ email, roleId, token });

        if (!info || !user) {
            return { success: false, message: "Fehler beim Senden der E-Mail." };
        }

        return {
            success: true
        };
    } catch (error) {
        console.error("Fehler beim Senden der E-Mail:", error);
        return {success: false, message: "E-mail konnte nicht gesendet werden."};
    }
}

module.exports = {
    createUser: createUser,
    fetchUsers: fetchUsers,
    fetchLogin: fetchLogin,
    sendEmail: sendEmail
};
