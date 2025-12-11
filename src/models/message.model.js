import { SchemaTypes } from "mongoose";
import { model, Schema, SchemaType } from "mongoose";

const messageSchema = new Schema(
    {
        sender: {
            type: SchemaTypes.ObjectId,
            ref: "users",
            required: true,
        },
        reciever: {
            type: SchemaTypes.ObjectId,
            ref: "users",
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        documents: {
            type: [SchemaTypes.ObjectId],
            ref: 'documents',
            trim: true,
        }
    },
    {
        timestamps: true
    }
);
export const messageModel = model('messages', messageSchema);
