import { Schema, SchemaTypes, model } from "mongoose";


// status = null -> pending
// status = 1 -> accepted
// status = 0 -> rejected

// from -> user ID who sents the request
// to -> user ID whome request is sent to

// entityID != null  -> request is to join the group 
// entityID = null  -> request is chat request(friend request)



const requestSchema = new Schema(
    {
        from: {
            type: SchemaTypes.ObjectId,
            ref: 'users',
            required: true,
        },
        to: {
            type: SchemaTypes.ObjectId,
            required: true,
        },
        type: {
            type: String,
            enum: ['DM', 'chat'],
            trim: true,
            required: true,
        },
        status: {
            type: Number,
            enum: [0, 1],
            default: null,
        }
    },
    {
        timestamps: true
    }
);


export const requestsModel = model('requests', requestSchema);