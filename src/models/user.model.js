import { Schema, model } from 'mongoose';
import bycrypt from 'bcrypt';
import { ConsoleLog } from '../utils/console.util.js';

const userSchema = new Schema(
    {
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
            required: true,
            validate: {
                validator: function (v) {
                    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}/.test(v);
                },
                message: (props) => `${props.value} is not a valid password!`
            }
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
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        try {
            let hashedPassword = bycrypt.hashSync(this.password, 10);
            this.password = hashedPassword;
        } catch (error) {
            ConsoleLog('error', 'unable to hash password:', error);
            return next(error);
        }
    }
});

export const userModel = model('users', userSchema);