import nodemailer from "nodemailer"
import {configDotenv}  from 'dotenv'

configDotenv()

export const generateOtp = async (userName,email)=> {
  try {
    const otp = ("" + Math.random()).substring(2, 8)
    console.log(otp);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOption = {
      from: 'vyshnavkv12345@gmail.com',
      to: email,
      cc: 'vyshnavkvpanalad@gmail.com',
      subject: 'OTP Verification mail',
      text: `hello ${userName} your otp ${otp}`,
    };

    transporter.sendMail(mailOption, function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('email has been set' + info.response);
      }
      return otp
  })

    return otp;
  } catch (error) {
    console.log(error.message);
    throw error; 
  }
};



