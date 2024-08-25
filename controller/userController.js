
const passport = require('passport');
const userModel=require('../model/userModel');
const bcrypt=require('bcrypt')


exports.signUp=async(req,res)=>{
try {
    const {
        firstName
        ,lastName
        ,email
        ,password
        
        }=req.body
        if(!email||!firstName||!password||!lastName){
            return res.status(400).json({
                message:'please enter all details'
            })
        }
        const saltedRounds=await bcrypt.genSalt(12)
        const hashedPassword=await bcrypt.hash(password,saltedRounds)
        const data=new userModel({
            firstName
            ,lastName
            ,email:email.toLowerCase()
            ,password:hashedPassword   
        })
        await data.save()
        res.status(201).json({
            message:"new user created",
            data
        })
} catch (error) {
    if(error.code === 11000){
        const whatWentWrong=object.Keys(error.keyValue)[0]
        return (res.status(500).json(`user with this ${whatWentWrong} already exist`))
    }else{
        res.status(500).json({
            errorMessage:error.message
        })
    }
    }
  
}

exports.homePage=async(req,res)=>{
    try {
        if(!req.session.user){
       return res.status(401).json(`you are not authenticated,welcome our guest`)
        }else{
            const findUser=await userModel.findOne({email:req.session.user})
       res.status(200).json(`welcome ${findUser.firstName}`)
        }
    } catch (error) {
 res.status(500).json({
    errorMessage:error.message
 })       
    }
}
exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const checkEmail=await userModel.findOne({email:email.toLowerCase()})
        if(!checkEmail){
       return res.status(404).json('user not found')
        }
        const checkPassword=await bcrypt.compare(password,checkEmail.password)
        if(!checkPassword){
        return res.status(400).json('incorrect password')
        }
        req.session.user=checkEmail.email
        res.status(200).json({
            message:'login successful',
            data:checkEmail
        })
    } catch (error) {
        res.status(500).json({
            errorMessage:error.message
        })
    }
}
exports.logout=async(req,res)=>{
    req.session.destory()
    res.status(200).json('logout successful')
}
exports.callback=passport.authenticate('google',{
    successRedirect:"/api/v1/success/signup",
failureRedirect:'/homepage'})
exports.createInfowithturnedInfo=async(req,res)=>{
    try {
        const checkUser=await userModel.findOne({email:req.user._json.email})
        if(checkUser){
            req.session.user=checkUser.email
            return res.redirect('/api/v1/homepage')
        }
        const data=new userModel({
            firstName:req.user._json.name.split(' ')[0],
            lastName:req.user._json.name.split(' ')[1],
            email:req.user._json.email,
            profilePicture:req.user._json.picture,
            isVerified:req.user._json.email_verified
        })
        await data.save()
        res.status(200).json({
            message:'user created ok',
            data
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}
exports.signInWithGoogle=passport.authenticate('google', { scope: ['email','profile'] })