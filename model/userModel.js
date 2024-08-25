const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    firstName:{
     type:String,
     require:true,
     trim:true   
    },
    lastName:{
    type:String,
    require:true,
    trim:true   
       },
    email:{
    type:String,
    require:true,
    unique:true   
       },
    password:{
    type:String,
    },
    profilePicture:{
    type:String,
    require:true  
    },
    isVerified:{
    type:Boolean,
    default:false  
    },
    provider:{
      type:Boolean,
      default:false  
      }
},{timestamps:true});

const userModel=mongoose.model('socialauth',userSchema)

module.exports=userModel