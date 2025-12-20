import { check, validationResult } from 'express-validator';
import { userModel } from '../models/user.model.js';
import { ConsoleLog } from '../utils/console.util.js';
import { Types } from 'mongoose';

export const passwordValidator = [
    check('password')
        .notEmpty()
        .withMessage('Password is required'),

    check('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,12}$/)
        .withMessage('Password length must be 6-12 char long, must contain at least one uppercase, one lowercase letter, at least one number and at least one special character (@ $ ! % * ? &)'),

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
                return res.status(400).json({ error: 'Incorrect sender & reciever Ids' });
            } else if (doc.length < 2) {
                return res.status(400).json({ error: doc[0]._id == sender ? 'Incorrect reciever ID' : 'Incorrect sender ID' })
            }
        } catch (error) {
            ConsoleLog('error', 'api = api/message: unable to find users', error);
            return res.status(500).json({ error: { message: 'Internal server error' } });
        }
        next();
    }
]

export const userSearchValidator = [
    check('q')
        .notEmpty()
        .withMessage('search query cant be empty'),

    check('by')
        .notEmpty()
        .withMessage('search by cant be empty, possible values: name, email'),

    check('by')
        .custom((value) => ['name', 'email'].includes(value))
        .withMessage('by must be either name or email'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // custom validations
        if (!req.body) {
            return res.status(400).json({ error: 'body cant be empty searching params required' })
        }
        next();
    }
]

export const userRequestValidator = [
    check('from')
        .notEmpty()
        .withMessage(`from is required, it must be userId of request sender`),

    check('to')
        .notEmpty()
        .withMessage(`to is required, it can be userId or connectionId`),

    check('type')
        .notEmpty()
        .withMessage(`type is required, possible values: 'DM', 'chat'`),

    check(["from", "to"])
        .custom((value) => Types.ObjectId.isValid(value))
        .withMessage("Invalid ID"),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // custom validations
        const { from, to, type } = req.body;
        if (['DM', 'group'].indexOf(type) == -1) {
            return res.status(400).json({ error: 'type must be either DM or group' });
        }
        next();
    }
]

export const requestActionValidator = [
    check('from')
        .notEmpty()
        .withMessage(`from is required, it must be userId of request sender`),

    check('to')
        .notEmpty()
        .withMessage(`to is required, it can be userId or connectionId`),

    check('type')
        .notEmpty()
        .withMessage(`type is required, possible values: 'DM', 'chat'`),

    (req, res, next) => {
        const { action } = req.params;
        const { type } = req.body
        if (['DM', 'group',].indexOf(type) == -1) {
            return res.status(400).json({ error: 'type must be either DM or group' });
        }
        if ((!action) || (['accept', 'reject', 'unfollow'].indexOf(action) == -1)) {
            return res.status(400).json({ error: 'action is undefined it should be either accept or reject' });
        }
        next();
    }
]


export const createConnectionValidator = [
    check('type')
        .notEmpty()
        .withMessage('type cant be empty options:DM, chat'),

    check('type')
        .notEmpty()
        .withMessage('type cant be empty options:DM, chat'),

    check('type')
        .notEmpty()
        .withMessage('type cant be empty options:DM, chat'),


    check('type')
        .notEmpty()
        .withMessage('type cant be empty options:DM, chat'),

    check('type')
        .notEmpty()
        .withMessage('type cant be empty options:DM, chat'),

    check('type')
        .notEmpty()
        .withMessage('type cant be empty options:DM, chat'),

    check('type')
        .notEmpty()
        .withMessage('type cant be empty options:DM, chat'),
]

export const connectionTypevalidator = [
    (req, res, next) => {
        const { type } = req.query;
        if (type == undefined) {
            return res.status(400).json({ error: 'type is required' });
        }
        if (type && ['DM', 'group'].indexOf(type) == -1) {
            return res.status(400).json({ error: 'type must be either DM or group' });
        }
        next();
    }
]