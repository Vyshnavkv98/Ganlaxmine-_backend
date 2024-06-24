import {Profile} from '../model/profileModel.js';

export const createNewProfile = async (profileData) => {
    try {
        const newProfile = new Profile(profileData);
        await newProfile.save();
        return { status: 201, message: 'Profile created successfully.', profile: newProfile };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Failed to create profile.' };
    }
};

export const getProfileByUserId = async (userId) => {
    try {
        const profile = await Profile.findOne({ user: userId }).populate('user', 'email');
        if (!profile) {
            return { status: 404, message: 'Profile not found.' };
        }
        return { status: 200, message: 'Profile retrieved successfully.', profile };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Failed to retrieve profile.' };
    }
};

export const updateUserProfile = async (userId, profileData) => {
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: profileData },
            { new: true }
        );
        if (!updatedProfile) {
            return { status: 404, message: 'Profile not found.' };
        }
        return { status: 200, message: 'Profile updated successfully.', profile: updatedProfile };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Failed to update profile.' };
    }
};

export const deleteUserProfile = async (userId) => {
    try {
        const deletedProfile = await Profile.findOneAndDelete({ user: userId });
        if (!deletedProfile) {
            return { status: 404, message: 'Profile not found.' };
        }
        return { status: 200, message: 'Profile deleted successfully.', profile: deletedProfile };
    } catch (error) {
        console.error(error);
        return { status: 500, message: 'Failed to delete profile.' };
    }
};
