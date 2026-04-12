const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },
        role: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
            default: "",
        },
        jobType: {
            type: String,
            enum: ["Full-time", "Part-time",  "Internship"],
            default: "Applied",
        },
        status: {
            type: String,
            enum: ["Applied", "shortlisted", "Interview", "Offer", "Rejected"],
            default: "Applied",
        },
        jobLink: {
            type: String,
            trim: true,
            default: "",
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        deadline: {
            type: Date,
        }, 
        salary: {
            type: String,
            default: "",
        },
        source: {
            type: String,
            trim: true,
            default: "",
        },
        notes: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;