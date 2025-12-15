// connection: 
// a chat or DM is a connection (b/w single user to single user)
// a group is also a connection (b/w multiple users)

import { model, Schema, SchemaTypes } from "mongoose";


// whever a user accepted a quest a connection will be created
// if user sents a DM type request and another user accpets it then connection is DM type
// if user sents a group request and the other user accepts it then connection is group type

const connectionSchema = new Schema(
    {
        type: {
            type: String,
            trim: true,
            enum: ['DM', 'chat'],
            required: true,
        },
        isPrivate: {
            type: Boolean,
            required: true,
            default: true
        },
        createdBy: {
            type: SchemaTypes.ObjectId,
            ref: 'users',
            required: true,
        },
        name: {
            type: String,
            trim: true,
            maxlength: 100,
            default: null
        },
        description: {
            type: String,
            trim: true,
            maxlength: 250,
            default: null
        },
        profilePic: {
            type: SchemaTypes.ObjectId,
            ref: 'documents',
            default: null
        },
        admins: {
            type: [{
                type: SchemaTypes.ObjectId,
                ref: 'users',
            }],
            required: true,
            default: function () {
                return [this.createdBy]
            },
            validate: {
                validator: (v) => v.length <= 5,
                message: 'Out of admins limit'
            }
        },
        members: {
            type: [{
                type: SchemaTypes.ObjectId,
                ref: 'users',
            }],
            required: true,
            default: function () {
                return [this.createdBy]
            },
            validate: {
                validator: (v) => v.length <= 100,
                message: 'Out of members limit'
            }
        }
    },
    { timestamps: true }
);



export const connectionModel = model('connections', connectionSchema);