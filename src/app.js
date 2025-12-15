import path from 'path';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import logger from './middlewares/logger.middleware.js';
import { userRoutes } from './routes/user.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { messsageRoute } from './routes/message.routes.js';
import { chatRoutes } from './routes/chat.routes.js';
import { groupRoutes } from './routes/group.routes.js';
import { connectionRoutes } from './routes/connection.routes.js';
import { authMe } from './middlewares/authMe.middleware.js';

const app = express();

// global middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')))
app.use(cookieParser())
app.use(logger);


// open routes
app.use('/api/auth', authRoutes);

// protected routes
app.use(authMe)
app.use('/api/user', userRoutes);
app.use('/api/connection', connectionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/group', groupRoutes);



// app.use('/api/send', messsageRoute);


// not found middleware
app.use((req, res) => {
    res.send(`<h1>Welcome to Chat-app</h1>`);
})


export default app;