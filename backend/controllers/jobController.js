const Job = require("../models/Job");

const createJob = async(req, res) => {
    try {
        const {
            company,
            role,
            location,
            jobType,
            status,
            jobLink,
            appliedDate,
            deadline,
            salary,
            source,
            notes,
        } = req.body;

        if(!company || !role){
            return res.status(400).json({
                success: false,
                message: "Company and Role are required",
            });
        }

        const job = await Job.create({
            user: req.user._id,
            company,
            role,
            location,
            jobType,
            status,
            jobLink,
            appliedDate,
            deadline,
            salary,
            source,
            notes,
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: job,
        });
        
        
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({user: req.user._id}).sort({createdAt: -1});

        res.status(200).json({
            success: true,
            message: "Jobs fetched successfully",
            count: jobs.length,
            data: jobs,
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Server error while fetching jobs",
            error: error.message,
        });
    }
};

const getJobById = async (req, res) =>{
    try {
        const job = await Job.findOne({_id: req.params.id,
            user: req.user._id,
        });

        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            data: job,
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching job", 
            error: error.message,
        });
    }
};

const updateJob = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        });
            
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const updateJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updateJob,
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "server error while updating job",
            error: error.message,
        });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOne({
            _id: req.params.id,
            user: req.user._id,
        }
        );

        if(!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }
        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: "Job deleted successfully",

        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Server error while deleting job",
            error: error.message,
        });
    }

};

const getJobStats = async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user._id});

        const stats = {
            total: jobs.length,
            applied: jobs.filter((job)=> job.status=== "Applied").length,
            shortlisted: jobs.filter((job)=> job.status=== "Shortlisted").length,
            interview: jobs.filter((job)=> job.status==="Interview").length,
            offer: jobs.filter((job)=> job.status==="Offer").length,
            rejected: jobs.filter((job)=> job.status==="Rejected").length,
        };

        res.status(200).json({
            success: true,
            message: "Job statistics fetched successfully",
            data: stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching job statistics",
        });
    }
};
module.exports = { 
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobStats,
};
