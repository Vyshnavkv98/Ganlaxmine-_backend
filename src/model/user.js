import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { type: String, unique: true, required: true },
    phoneNumber: {
        type: String,
        required: true
    },
    age: Number,
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    premiumMember: {
        type: Boolean,
        default: false
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },  
    otp: String,
    otpExpiresAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
