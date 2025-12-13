import path from 'path';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import logger from './middlewares/logger.middleware.js';
import { userRoute } from './routes/user.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import { messsageRoute } from './routes/message.routes.js';

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

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);
app.use('/api/send', messsageRoute);


// not found route
app.use((req, res) => {
    res.send(`<h1>404</h1>`);
})


export default app;