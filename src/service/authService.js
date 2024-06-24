import mongoose from "mongoose";
import { User } from "../model/user.js";
import { generateOtp } from "../utils/generateOtp.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Profile } from "../model/profileModel.js";

export const userSignup = async (userData) => {
    try {
        const { email, name, password, profilePhoto, phoneNumber } = userData
        const existingUser = await User.findOne({ email });
        if (existingUser) {

            if (existingUser.otp !== undefined || existingUser.otpExpiresAt < new Date()) {
                const otp = await generateOtp(name, email)
                const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)
                let response = await User.updateOne(
                    { email },
                    { $set: { otp, otpExpiresAt } }
                );

                if (response) return { status: 400, message: 'please complete otp verification' };
            } else {
                return { status: 400, message: 'User already exists' };
            }


        } else {

            const otp = await generateOtp(name, email)
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ email, password: hashedPassword, phoneNumber, profilePhoto, name, otp: otp, otpExpiresAt: otpExpiresAt });
            let response = await newUser.save();


            if (response) return { status: 400, message: 'please complete otp verification' };
        }

    } catch (error) {
        console.log(error);
    }
}

export const verifyOtp = async (email, otp) => {
    try {
        console.log(email, otp);
        const user = await User.findOne({ email });
        if (!user) {
            return { status: 400, message: 'User not found.' };
        }

        if (user.otp !== otp || user.otpExpiresAt < new Date()) {
            return { status: 400, message: 'Invalid or expired OTP.' };
        }

        user.isOtpVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        return { status: 200, message: 'OTP verified successfully.' };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Error verifying OTP.' };
    }
};

export const handleGoogleUser = async (profile) => {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });
  
    if (user) {
      return user;
    }

    console.log(profile);
  
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: email,
      profilePhoto: profile.photos[0].value,
    });
  
    await user.save();
    return user;
  };

  export const getUserById = async (id) => {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  };

export const authenticateUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { status: 404, message: 'User not found.' };
        }

        if (user.isOtpVerified == false) return { status: 404, message: 'Please complete otp verification.' };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { status: 400, message: 'Invalid credentials.' };
        }

        const payload = {
            user: {
                id: user.id,
                email: user.email
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { status: 200, message: 'User signin successful.', token };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Server error.' };
    }
};


export const canUserChat = async (userId) => {
    try {
        console.log(userId);
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        const isPremiumUser = user.premiumMember;

        return isPremiumUser;
    } catch (error) {
        console.error('Error checking premium status:', error);
        return false;
    }
};
export const initiatePayment = async (userId) => {
    try {
        console.log(userId);
        const user = await User.findByIdAndUpdate(userId, {
            premiumMember: true
        }, { new: true });

        if (!user) {
            throw new Error('User not found.');
        }

        const isPremiumUser = user.premiumMember;

        return isPremiumUser;
    } catch (error) {
        console.error('Error checking payment status:', error);
        return false;
    }
};


export const findMatches = async (userId) => {
    try {

        const userData = await User.findById(userId)
        let genderPreference;
        if (userData.gender === 'male') {
            genderPreference = 'female';
        } else if (userData.gender === 'female') {
            genderPreference = 'male';
        } else {
            throw new Error('Invalid gender');
        }

        const profiles = await Profile.aggregate([
            {
                $match: {
                    gender: genderPreference
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    religion: 1,
                    community: 1,
                    relationshipStatus: 1,
                    country: 1,
                    state: 1,
                    city: 1,
                    working: 1,
                    aboutUser: 1,
                    images: { $arrayElemAt: ['$images', 0] },
                    passions: 1,
                    'user.name': 1,
                    'user.email': 1,
                    'user.gender': 1
                }
            }
        ]);

        console.log(profiles, 'matches');

        if (profiles.length === 0) {
            return res.status(404).json({ message: 'No profiles found with the specified gender preference.' });
        }

        return profiles;
    } catch (error) {
        console.error('Error finding matches:', error);
        return [];
    }
};
