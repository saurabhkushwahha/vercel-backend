const User = require("../models/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie")

exports.signup = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            console.log("One or more fields are empty or undefined.");
            throw new Error("All fields are required")
        }

        const UserAlreadyExists = await User.findOne({ email });

        if (UserAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already Exists" })
        }


        // create a user
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashPassword,
            name,

        })

        await user.save();
        generateTokenAndSetCookie(res, user._id)
        res.status(201).json({

            success: true,
            message: "User created Successfully ",
            user: {
                ...user._doc,
                password: undefined,

            }
        })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message + " dekho bahu ho gaya hai" })
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with provided email");
            return res.status(400).json({ success: false, message: "Invalid credentials email not found!" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Password is incorrect");
            return res.status(400).json({ success: false, message: "Invalid credentials Password not correct!" });
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastlogin = new Date();
        await user.save();
        res.status(200).json({
            success: true, message: "Login successfully", user: {
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        console.log("Error in Login ", error)
        res.status(400).json({ success: false, message: error.message })
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('token')
    return res.status(200).json({ success: true, message: "Logout Succsssfully!" })
}

exports.checkAuth = async (req, res) => {

    try {
        const userId = req.userId
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ sucess: false, message: "User not found !" })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.error("Signup error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }


}
