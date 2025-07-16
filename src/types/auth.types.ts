import {z} from "zod"

export const signupSchema = z.object({
        username  : z.string(),
        password : z.string().min(8).max(16),
        email : z.string().email()
    })

export type SignUpInput = z.infer<typeof signupSchema>


export const signInSchema = z.object({
    email : z.string().email() ,
        password : z.string().min(8).max(16)
    })

export type SignInInput = z.infer<typeof signInSchema>

export type AuthResponse = {
    success : boolean ,
    message : string
}

export type TokenResponse = {
    success : boolean,
    message : string,
    data? : object
}