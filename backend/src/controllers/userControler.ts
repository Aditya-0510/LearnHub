import type { Request, Response } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import z from "zod";
import client from "../prismaClient.js";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "ddd"

export const signUp = async(req: Request, res: Response)=>{

    const { name, email, password, role } = req.body;
    const requiredBody = z.object({
        email: z.string().email(),
        password: z.string().min(5),
        name: z.string().min(3).max(100),
        role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"])
    })

    const parsedData = requiredBody.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({
            message: "Incorrect format"
        })
    }

    console.log(email);
    try{
        const existingUser = await client.user.findFirst({ 
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(409).send({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,5)
        await client.user.create({
            data: {
                username: name,
                email: email,
                password: hashedPassword,
                role: role
            }
        })

        res.send({
            message: "User created",
            success: true
        })
    }
    catch(e){
        res.status(500).send({
            message: "Error in creating user",
            success: false
        })
    }
}

export const signIn = async(req: Request,res: Response)=>{

    const { email, password } = req.body;
    console.log(email + password);
    try{
         const user = await client.user.findFirst({ 
            where: {
                email: email
            }
        });
        console.log(user);
        if(!user){
            return res.status(401).send({
                message: "user not found",
                success: false
            })
        }
        const match = await bcrypt.compare(password,user.password);
        if(match){
            const token = jwt.sign({
                id: user.id
            },JWT_SECRET)

            res.send({
                message: "user logged in succesfully",
                token: token,
                success: true,
                role: user.role
            })
        }
        else{
            return res.status(401).send({
                message: "incorrect password",
                success: false
            })
        }
    }
   
    catch(e){
       res.status(500).send({
            message: "Error in logging user",
            success: false
        })
    }
}