const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // optional if student login
    role: {
        type: String,
        enum: ["student", "admin"],
        default: "student"
    }

});

module.exports = mongoose.model("User", UserSchema);
