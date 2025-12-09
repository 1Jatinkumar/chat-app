import mongoose from "mongoose";
import { ConsoleLog } from "../utils/console.util.js";
import env from 'dotenv';
import path from 'path';

env.config({ path: path.resolve('./.env') });

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT_URL);
        ConsoleLog('success', 'DB connected successfully')
    } catch (error) {
        ConsoleLog('error', 'DB connection failed', error);
        process.exit(1);
    }
}

export default connectDb;