import { SchemaTypes } from "mongoose";
import { model, Schema, SchemaType } from "mongoose";

const messageSchema = new Schema(
    {
        from: {
            type: SchemaTypes.ObjectId,
            ref: "users",
            required: true,
        },
        to: {
            type: SchemaTypes.ObjectId,
            ref: "connections",
            required: true,
        },
        message: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            enum: ['text', 'file', 'image'],
            required: true
        }
    },
    {
        timestamps: true
    }
);


messageSchema.pre('save', function () {
    if (this.type == 'text' && !this.message) {
        throw new Error(`message can't be empty`);
    }
});


export const messageModel = model('messages', messageSchema);
