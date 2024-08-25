const express=require ('express');
const passport=require('passport')
require('./config/db')
const router=require('./router/userRouter')
const app=express();
app.use(express.json());
const session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.session_secret,
  resave: false,
  saveUninitialized: true,
 //cookie: { secure: true }
}))
app.use(passport.initialize())
app.use(passport.session())

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.clientSecret,
    callbackURL: process.env.callbackURL
  },
  function(req,accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  
))
passport.serializeUser((user,done)=>{
  done(null,user)
})
passport.deserializeUser((user,done)=>{
done(null,user)
})
app.use("/api/v1",router)

const PORT=process.env.PORT||1960
app.listen(PORT,()=>{
    console.log(`app is running on port :${PORT}.`);
})