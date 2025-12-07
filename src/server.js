import path from 'path';
import dotenv from 'dotenv';
import app from "./app.js";
import connectDb from "./config/db.config.js";
import ConsoleLog from "./utils/console.util.js";

dotenv.config({ path: path.resolve('./.env') });

connectDb().then(() => {
    const port = process.env.SERVER_PORT || 8000;
    app.listen(port, (err) => {
        if (err) {
            ConsoleLog('error', 'Server start failed', err)
        } else {
            ConsoleLog('success', `Server is running on http://localhost:${port}/`)
        }
    })
});