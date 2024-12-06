import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let users = [
    { email: 'tukaev.arthur@mail.ru', isActivated: false }
];

const SECRET_KEY = process.env.SECRET_KEY;

const generateActivationToken = (email) => {
    return jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
};

const sendActivationEmail = (email) => {
    const token = generateActivationToken(email);
    const activationLink = `http://localhost:${process.env.PORT}/activate/${token}`;

    const transporter = nodemailer.createTransport({
        service: 'mail.ru',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Активация аккаунта',
        html: `<p>Для активации аккаунта перейдите по следующей <a href="${activationLink}">ссылке</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Ошибка отправки письма:', error);
        } else {
            console.log('Письмо отправлено:', info.response);
        }
    });
};

export const registerUser = (req, res) => {
    const { email } = req.body;

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
    }

    const newUser = { email, isActivated: false };
    users.push(newUser);

    sendActivationEmail(email);

    res.status(201).json({ message: 'Пользователь создан. Проверьте свою почту для активации!' });
};

export const activateAccount = (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = users.find((u) => u.email === decoded.email);

        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден!' });
        }

        user.isActivated = true;
        res.status(200).send('Аккаунт успешно активирован!');
    } catch (error) {
        return res.status(400).json({ message: 'Неверный или просроченный токен!' });
    }
};
