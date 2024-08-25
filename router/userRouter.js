const { signUp, homePage, login, logout, signInWithGoogle, callback, createInfowithturnedInfo } = require('../controller/userController')
const passport=require('passport')

const router=require('express').Router()

router.post('/signup',signUp)
router.get('/homepage',homePage)
router.post('/login',login)
router.post('logout',logout)
router.get('/signupwithgoogle',signInWithGoogle)
router.get('/google/callback',callback)
router.get('/success/signup',createInfowithturnedInfo)
module.exports=router