import { model, Schema } from "mongoose";

const documentSchema = new Schema(
    {
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
        documentType: {
            type: String,
            enum: ['image', 'document'],
            trim: true,
            required: true
        }
    },
    { timestamps: true }
);

export const documentModel = model('documents', documentSchema);

