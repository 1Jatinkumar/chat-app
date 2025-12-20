
import fs from 'fs';
import path from 'path'
import { ConsoleLog } from '../utils/console.util.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
*/
function logger(req, res, next) {
    const date = new Date();
    const monthName = date.toLocaleString("en-us", { month: "long" })

    const dirPath = path.resolve(`logs/${date.getFullYear()}/${monthName}`);
    const filePath = dirPath + `/serverRequest_${date.getDate()}.log`

    fs.mkdir(dirPath, { recursive: true }, (dirErr) => {
        if (dirErr) {
            ConsoleLog('error', 'making serverRequest dir failed', dirErr);
        } else {
            const { method, originalUrl, ip } = req;
            const fileContent = `[${originalUrl}] [${method}] [${ip}] [${date.toTimeString()}]  [body: ${JSON.stringify(req.body)}]\n`;

            fs.appendFile(filePath, fileContent, (fileErr) => {
                fileErr && ConsoleLog('error', 'serverRequest log failed', fileErr)
            })
        }
    })
    next();
}
export default logger;