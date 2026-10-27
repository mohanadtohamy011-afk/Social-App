import * as z from "zod";

export const registerSchema = z.object({

    name: z.string().nonempty("Name is Required").min(3, "min chars is three").max(10, "max chars is ten"),

    username: z.string().nonempty("UserName is Required").min(3, "min chars is three").max(10, "max chars is ten"),

    email: z.string().nonempty("Email is Required").email("Email is not Vaild"),

    dateOfBirth: z.string().nonempty("Date of Birth is Required").refine((date) => {

        const currentYear = new Date().getFullYear();
        const userYear = new Date(date).getFullYear();
        const age = currentYear - userYear

        return age > 18

    }, "User must be Older than 18"),

    gender: z.string().nonempty("Gender is Required"),

    password: z
        .string()
        .nonempty("password is Required").regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
            "Password must contain uppercase, lowercase, number, special character and be at least 8 characters"
        ),


    rePassword: z.string().nonempty("password is Required")

})
    .refine((data) => {
        return data.password === data.rePassword;
    },
        { path: ["rePassword"], message: "Password Not Match" },
    );


export const LoginSchema = z.object({ 
    email: z.string().nonempty("Email is Required").email("Email is not Vaild"),

    password: z
        .string()
        .nonempty("password is Required").regex(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/,
            "Password must contain uppercase, lowercase, number, special character and be at least 8 characters"
        ),

})
    

export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof LoginSchema>