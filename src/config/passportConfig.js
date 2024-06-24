import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getUserById, handleGoogleUser } from '../service/authService.js';
import { configDotenv } from 'dotenv';
configDotenv()
console.log(process.env.CLIENT_SECRET, process.env.CLIENT_ID);
try {
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('profile');
      console.log(profile);
      const user = await handleGoogleUser(profile);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id); 
      done(null, user); 
    } catch (error) {
      done(error, null);
    }
  });
} catch (error) {
  console.log(error);
}

export default passport;
