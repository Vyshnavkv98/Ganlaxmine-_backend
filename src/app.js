import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import { connectDb } from './config/dbConfig.js'

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
// import  from 'passport'
import passport from './config/passportConfig.js';

const app=express()
app.use(passport.initialize());

connectDb()

app.use(express.json())

app.use(cors())
app.use(logger('dev'))


app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);


app.listen(process.env.PORT || 4000,()=>{
    console.log('server running on port 4000');
})

export default app


