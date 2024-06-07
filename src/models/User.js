import mongoose from 'mongoose'

const  userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true
    },
    
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true
    },
    profile_pic:{
        type:String,
        default:""
    }

},{
    timestamps:true
})

 const UserModel = mongoose.model("User",userSchema)

 export default UserModel