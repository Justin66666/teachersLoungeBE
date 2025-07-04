import express from 'express';
import router from './routes.js';
import twoFactorRoutes from './twoFactor.js';
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(router);
app.use('/2fa', twoFactorRoutes);
app.use('/api/auth', twoFactorRoutes);

// Global error handler to prevent server crashes
app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err);
    if (!res.headersSent) {
        res.status(500).json({ 
            message: 'Internal server error', 
            error: err.message 
        });
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Don't exit the process, just log the error
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit the process, just log the error
});

// Debug environment variables
console.log('Environment variables check:');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('S3_ACCESS_KEY:', process.env.S3_ACCESS_KEY ? 'Set' : 'Not set');
console.log('S3_SECRET_KEY:', process.env.S3_SECRET_KEY ? 'Set' : 'Not set');
console.log('S3_BUCKET:', process.env.S3_BUCKET);

const PORT = process.env.PORT || 4001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on 0.0.0.0:${PORT}`);
});