const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require("./routes/jobRoutes");

dotenv.config();

const app = express();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => {
    const value = process.env[key];
    return !value || value.trim() === '' || value.startsWith('your_');
});

if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

const defaultAllowedOrigins = [
    'http://localhost:5173',
    'https://jobnest-personal-job-application-tracker.onrender.com',
];

const configuredAllowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
    ...new Set([...defaultAllowedOrigins, ...configuredAllowedOrigins]),
];

// CORS configuration
const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/jobs", jobRoutes);

// Health check endpoints
app.get("/", (req, res)=> {
    res.status(200).json({
        success: true,
        message: "JobNest API is running...",
    });
});

app.get("/api/health", (req, res)=> {
    res.status(200).json({
        success: true,
        message: "JobNest backend is healthy",
        timestamp: new Date().toISOString(),
    });
});

// Express 5 no longer accepts a bare "*" route pattern here.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`✓ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
