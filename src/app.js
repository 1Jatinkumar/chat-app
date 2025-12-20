import path from 'path';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import logger from './middlewares/logger.middleware.js';
import { userRoutes } from './routes/user.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { connectionRoutes } from './routes/connection.routes.js';
import { AccessTokenValidator } from './middlewares/AccessTokenValidator.middleware.js';
import { requestRoutes } from './routes/request.routes.js';

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
app.use(AccessTokenValidator);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/connections', connectionRoutes);


// not found middleware
app.use((req, res) => {
    res.send(`<h1>Welcome to Chat-app</h1>`);
})


export default app;