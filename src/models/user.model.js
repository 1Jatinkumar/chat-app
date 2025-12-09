import { Schema, model } from 'mongoose';
import bycrypt from 'bcrypt';
import { ConsoleLog } from '../utils/console.util.js';

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
        validate: {
            validator: function (v) {
                return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        minlength: 6,
        trim: true,
    },
    ip: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
    refreshToken: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true
});

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bycrypt.hash(this.password, 10, (err, hash) => {
            if (err) {
                ConsoleLog('error', 'unable to hash password:', err);
                return next(err);
            }
            this.password = hash;
            next();
        });
    }
});

export const userModel = model('users', userSchema);