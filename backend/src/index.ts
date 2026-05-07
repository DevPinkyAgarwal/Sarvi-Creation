import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import compression from 'compression';
import { createServer } from 'http';
import morgan from 'morgan';
import logger from './utils/logger';
import { initSocket } from './utils/socket';
import apiRoutes from './routes';

dotenv.config();

// Environment Variable Validation
const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
];

requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        logger.error(`❌ Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5151;

// Performance & Security Middlewares
app.use(compression());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health Check Endpoint (placed before rate limiting)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api', limiter);

// Auth endpoints stricter limiter
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// General Middlewares
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL as string, process.env.ADMIN_URL as string] 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Central API Router
app.use('/api', apiRoutes);

// Global 404 handler for any unmatched routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found.' });
});

// Advanced Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(`${err.message}`, { stack: err.stack, url: req.url, method: req.method });

    // Mongoose Validation Error Mapping
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val: any) => val.message);
        return res.status(400).json({
            message: 'Validation Error',
            details: messages
        });
    }

    // Cast Error (e.g., malformed ObjectId)
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Resource not found with ID: ${err.value}` });
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate field value entered' });
    }

    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Database Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error(`❌ MongoDB connection error: ${error}`);
        process.exit(1);
    }
};

// Initialize Socket.io
initSocket(httpServer);

// Start Server
connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
    });
});
