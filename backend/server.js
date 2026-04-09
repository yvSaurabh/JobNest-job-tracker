const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res)=> {
    res.send("JobNest API is running...");
});

app.get("/api/health", (req, res)=> {
    res.status(200).json({
        success: true,
        message: "JobNest backend is healthy",
    });
});

if(
    process.env.MONGO_URI &&
    process.env.MONGO_URI !== "your_mongodb_connection_string_here"
) {
    connectDB();
}else{
    console.log("MongoDB connection string is not set. Please set MONGO_URI in your .env file.");
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});