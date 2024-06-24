import {createNewProfile,deleteUserProfile,getProfileByUserId,updateUserProfile} from '../service/profileService.js';

export const createProfile = async (req, res) => {
    const profileData = req.body;
    const userId=req._id
    try {
        const response = await createNewProfile({...profileData,userId:userId});
        res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getProfile = async (req, res) => {
    const userId = req._id;
    try {
        const response = await getProfileByUserId(userId);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateProfile = async (req, res) => {
    const userId = req._id;
    const profileData = req.body;
    try {
        const response = await updateUserProfile(userId, profileData);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const deleteProfile = async (req, res) => {
    const userId = req._id;
    try {
        const response = await deleteUserProfile(userId);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
