import express from 'express';
import logger from './middlewares/logger.middleware.js';
import { userRoute } from './routes/user.routes.js';
import { authRoutes } from './routes/auth.routes.js';
import path from 'path';

const app = express();

// global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve('public')))

app.use(logger);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoute);


// not found route
app.use((req, res)=>{
    res.send(`<h1>404</h1>`);
})


export default app;