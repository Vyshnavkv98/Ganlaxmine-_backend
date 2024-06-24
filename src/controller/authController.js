import bcrypt from 'bcrypt'
import { authenticateUser, userSignup, verifyOtp ,canUserChat, initiatePayment,findMatches} from '../service/authService.js'
import {OAuth2Client} from 'google-auth-library'
import passport from '../config/passportConfig.js';


export const signup = async (req, res) => {
    try {
        let userData = req.body
        console.log(userData);
        let response = await userSignup({ ...userData, profilePhoto: req.file.path })
        res.status(response.status).send(response.message);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error signing up user.');
    }
};
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = (req, res) => {
  // Redirect to the homepage or send a response with a JWT token
  res.redirect('/'); // You can also generate and send a JWT token here
};


export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(req.body, 'controll');
        let response = await verifyOtp(email, otp)
        return res.status(response.status).send(response.message);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error verifying OTP.');
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await authenticateUser(email, password);

        if (response.status === 200) {
            res.status(response.status).json({message: response.message , token: response.token });
        } else {
            res.status(response.status).json({ message: response.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};


export const initiateChat = async (req, res) => {
    const userId = req._id

    try {
        const canChat = await canUserChat(userId);

        if (!canChat) {
            return res.status(403).json({ message: 'User is not a premium user. Unable to initiate chat.' });
        }
        return res.status(200).json({ message: 'Chat initiated successfully.' });
    } catch (error) {
        console.error('Error initiating chat:', error);
        return res.status(500).json({ message: 'Failed to initiate chat.' });
    }
};


export const payment = async (req, res) => {
    const userId = req._id

    try {
        const response = await initiatePayment(userId);

        if (!response) {
            return res.status(403).json({ message: 'payment not completed.' });
        }
        return res.status(200).json({ message: 'payment completed successfully.' });
    } catch (error) {
        console.error('Error initiating payment:', error);
        return res.status(500).json({ message: 'Failed to initiate payment.' });
    }
};

export const getMatches = async (req, res) => {

    try {
        const userId=req._id
        const matches = await findMatches(userId);

        return res.status(200).json({ matches });
    } catch (error) {
        console.error('Error fetching matches:', error);
        return res.status(500).json({ message: 'Failed to fetch matches.' });
    }
};

