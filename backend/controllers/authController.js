const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields",
            });
        }
        const userExists = await User.findOne({ email});

        if(userExists) {
            return res.status(400). json({
                success: false,
                message: "User already exists",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            },
        });

            
    } catch (error){
        res.status(500).json({
            success: false,
            message: "Server error while registering user",
            error: error.message,
        });
    }
    
};

const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields",
            });
        }
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
    }
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            _id: user._id,
            name : user.name,
            email: user.email,
            token: generateToken(user._id),
        },
    });
  } catch(error) {
    res.status(500).json({
        success: false,
        message: "server eror while logging in user",
        error: error.message,
    });
}


}
module.exports = {
    registerUser,
    loginUser,
};
