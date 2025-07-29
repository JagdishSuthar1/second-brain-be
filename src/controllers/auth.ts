import { z } from "zod";
import bcrypt from "bcryptjs"
import userModel from "../db/user"
import { Request, RequestHandler, Response } from "express";
import { SignUpInput, signupSchema, AuthResponse, SignInInput, signInSchema, TokenResponse } from "../types/auth.types"
import jwt from "jsonwebtoken"
import env from "dotenv";
env.config();

export const SignUp: RequestHandler<{}, AuthResponse, SignUpInput> = async (req, res) => {

    const signupData = req.body as SignUpInput;

    if (signupData) {
        const parsedSignupData = signupSchema.safeParse(signupData);
        if (parsedSignupData.success == true) {

            const hashedPassword = await bcrypt.hash(parsedSignupData.data.password, 3);
            try {

                await userModel.create({
                    username: parsedSignupData.data.username,
                    password: hashedPassword,
                    email: parsedSignupData.data.email
                })

                res.status(200).json({
                    success: true,
                    message: "Sign up Successfully"
                })

            }
            catch (err) {

                //console.log(err);
                res.status(404).json({
                    success: false,
                    message: "Database Error"
                })
            }
        }
        else {
            res.status(400).json({
                success: false,
                message: "Data format Error"
            })
        }
    }
    else {
        res.status(404).json({
            success: false,
            message: "Data format error"
        })

    }

}



export const SignIn: RequestHandler<{}, TokenResponse, SignInInput> = async (req, res) => {

    const signInData = req.body as SignInInput;

    if (signInData) {
        const parsedSignInData = signInSchema.safeParse(signInData);
        if (parsedSignInData.success == true) {
            try {
                const user = await userModel.findOne({ email: parsedSignInData.data.email });
                if (user) {
                    const checkPassword = await bcrypt.compare(parsedSignInData.data.password, user.password);
                    if (checkPassword == true) {

                        const token = jwt.sign({
                            id: user._id,
                            password: user.password,
                            email: user.email
                        }, process.env.JWT_SECRET!)

                        res.status(200).json({
                            success: true,
                            message: "SignIn Successfully",
                            data: {
                                userId : user._id,
                                token : token
                            }
                        })
                    }
                    else {
                        res.json({
                            success: false,
                            message: "Unauthorised Access"
                        })
                    }

                }
                else {
                    res.json({
                        success: false,
                        message: "SignUp first"
                    })
                }
            }
            catch (err) {

                //console.log(err);
                res.status(404).json({
                    success: false,
                    message: "Database Error"
                })
            }
        }


        else {
            res.status(400).json({
                success: false,
                message: "Data format Error",
                data: parsedSignInData.error.format
            })
        }
    }
    else {
        res.status(404).json({
            success: false,
            message: "Fill the data correctly"
        })

    }

}