import express from 'express';
import logger from './middlewares/logger.middleware.js';
import userRoute from './routes/user.routes.js';

const app = express();

// global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// routes
app.use('/api/user', userRoute);


export default app;