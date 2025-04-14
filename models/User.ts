import mongoose, {Schema,model,models} from "mongoose";

import bcrypt from "bcryptjs";

export interface IUser{
    email:string,
    password:string,
    role:"user" | "admin"
}

const userSchema=new Schema({
    email:{type:String, required : true, unique:true},
    password:{type:String, required : true},
    role:{type:String, enum:["user","admin"], default:"user"},
}, {timestamps:true});

const User=models?.User || model("User",userSchema);

export default User