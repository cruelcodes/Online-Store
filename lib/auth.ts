import { connect } from "http2";
import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../models/User";
import {connectToDatabase} from "./db";
import bcrypt from "bcryptjs";
export const authOptions: NextAuthOptions={
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email: {label:"Email", type:"email", placeholder:"email"},
                username: {label:"Username", type:"text", placeholder:"username"},
                password: {label:"Password", type:"password", placeholder:"password"},
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Invalid credentials");
                }

                try {
                    await connectToDatabase();
                    const user=await User.findOne({email:credentials.email});
                    if(!user){
                        throw new Error("User not found with this email");
                    }

                    const isValid=await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if(!isValid){
                        throw new Error("Invalid credentials");
                    }
                    return {
                        id:user._id.toString(),
                        email:user.email,
                        role:user.role
                    }
                } catch(error){
                    console.error("Auth Error",error);
                    throw error
                }
            }
        })
    ],
    callbacks:{
        async session ({session,token}){
            session.user.id=token.id as string;
            session.user.role=token.role as string;
            return session;
        },
        async jwt({token,user}){
            if(user){
                token.id=user.id;
                token.role=user.role;
            }
            return token;
        }

    },
    pages:{
        signIn:"/login",
        error:"/login",
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60

    },
    secret:process.env.NEXTAUTH_SECRET


}