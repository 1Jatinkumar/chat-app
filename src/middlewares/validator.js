import { check, validationResult } from 'express-validator';
import { userModel } from '../models/user.model.js';
import { ConsoleLog } from '../utils/console.util.js';

export const passwordValidator = [
    check('password')
        .notEmpty()
        .withMessage('Password is required'),

    check('password')
        .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}/)
        .withMessage('Password must be at least 6 character long, must contain at least one uppercase, one lowercase letter, at least one number and at least one special character (@ $ ! % * ? &)'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];



export const emailValidator = [
    check('email')
        .notEmpty()
        .withMessage('email is required'),

    check('email')
        .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
        .withMessage('Invalid Email'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export const postMessageValidator = [
    check('sender')
        .notEmpty()
        .withMessage('sender as an Id is required'),

    check('reciever')
        .notEmpty()
        .withMessage('reciever as an id is required'),

    check('message')
        .notEmpty()
        .withMessage('message is required'),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { sender, reciever } = req.body;
        try {
            const doc = await userModel.find({ _id: { $in: [sender, reciever] } }).lean();
            if (doc.length == 0) {
                res.status(400).json({ error: 'Incorrect sender & reciever Ids' });
            } else if (doc.length < 2) {
                res.status(400).json({ error: doc[0]._id == sender ? 'Incorrect reciever ID' : 'Incorrect sender ID' })
            }
        } catch (error) {
            ConsoleLog('error', 'api = api/message: unable to find users', error);
            res.status(500).json({ error: { message: 'Internal server error' } });
        }
        next();
    }
]