import multer from "multer";
import path from 'path'
import fs from 'fs';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // note multer parse the data in the same order as it gets, 
        // so if you want to parse/get text data send send it in that order in formData
        let { isPrivate } = req.body;
        cb(null, getFileDir(file.mimetype, isPrivate));
    },
    filename: (req, file, cb) => {
        cb(null, getSenitizedFileName(file.originalname));
    }
})


const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,   // 5 MB each, max 5 files
        files: 5
    },
    fileFilter: (req, file, cb) => {
        const { isPrivate } = req.body;

        if (!ALLOWED.includes(file.mimetype)) {
            const fileNotAllowed = new Error(`${file.mimetype} is not allowed yet chose different format`);
            cb(fileNotAllowed, false);
        }

        let filePath = `${getFileDir(file.mimetype, isPrivate)}/${getSenitizedFileName(file.originalname)}`
        if (fs.existsSync(filePath)) {
            const DuplicateFileError = new Error('File with same name exist');
            cb(DuplicateFileError, false);
        }
        cb(null, true);
    }
})

export const customisedMulter = [
    upload.array('files', 5),

    // error middleware (will catch the error thown by multer);
    (err, req, res, next) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        next();
    }
]




export function getFileDir(mimetype, isPrivate) {
    let filePath;
    if (mimetype.includes('image')) {
        if (isPrivate === 'true') {
            filePath = path.resolve('private', 'images')
        } else {
            filePath = path.resolve('public', 'images')
        }
    } else {
        if (isPrivate === 'true') {
            filePath = path.resolve('private', 'documents')
        } else {
            filePath = path.resolve('public', 'documents')
        }
    }
    return filePath;
}

export function getSenitizedFileName(fileName) {
    return fileName.replaceAll(' ', '-');
}

export function getFilePath(file, isPrivate) {
    return getFileDir(file.mimetype, isPrivate) + '/' + getSenitizedFileName(file.originalname);
}