import { model, Schema } from "mongoose";

// table to store all the document sent by to user to user/users
const documentSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['image', 'document'],
            trim: true,
            required: true
        },
        path: {
            type: String,
            trim: true,
            required: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
    },
    { timestamps: true }
);

export const documentModel = model('documents', documentSchema);

