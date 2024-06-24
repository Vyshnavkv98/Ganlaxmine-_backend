import mongoose from "mongoose";
import {configDotenv}  from 'dotenv'
configDotenv()



export const connectDb = async () => {
    mongoose.set("strictQuery", false);
    
    try {
      console.log(process.env.MONGOURL)
      await mongoose.connect(`${process.env.MONGOURL}`);
      console.log("connected successfully..");
    } catch (error) {
      console.log(error);
    }
  };



