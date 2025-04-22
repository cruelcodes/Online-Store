import { connectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request:NextRequest) {
    try{
        const {email,password}=await request.json()
        if(!email || !password){
            return NextResponse.json({error:"Invalid credentials"},{status:400})
        }

        await connectToDatabase()
        const existingUser=await User.findOne({email})
        if(existingUser){
            return NextResponse.json({error:"User already exists"},{status:400});
        }
        await User.create({
            email,
            password,
            role:"user"
        })
        return NextResponse.json({message:"User created successfully"},{status:201})

    }catch(error){
        console.log("Register Error",error)
        return NextResponse.json({error:"Something went wrong"},{status:500})

    }        
}
    
