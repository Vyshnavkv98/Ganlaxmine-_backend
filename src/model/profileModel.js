import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    whoHandles: String,
    religion: String,
    community: String,
    relationshipStatus: String,
    country: String,
    state: String,
    city: String,
    gender:String,
    education: {
        courseName: String,
        collegeName: String,
        collegePlace: String
    },
    working: {
        status: Boolean,
        jobRole: String,
        companyName: String,
        workplace: String
    },
    aboutUser: String,
    images: [String],
    passions: [String]
},{timestamps:true});

export const Profile= mongoose.model('Profile', profileSchema);
