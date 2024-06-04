import z, { string } from "zod"
const User = z.object({
    userName : string().min(8,"minimum 8 characters").max(12,"maximum 12 characters"),
    email: string().email("please enter valid email"),
    password : string().min(12,"minimum 12 characters").max(16,"maximum 12 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"does not meet requirements"),
    confirmPassword : string()
    }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"], // Path to indicate where the error should appear
    });


export const validateUserSignup = (userName:string,email:string,password:string,confirmPassword:string) => {
    console.log("validateUser called")
    const res = User.safeParse({userName,email,password,confirmPassword})
    console.log(res)
    if(res.success){
        return {
            success : true
        }
    }
    else{
        const fieldErrors = res.error.issues.flat()
        console.log(fieldErrors)
        return {
            success : false,
            errors : fieldErrors.map((e)=>{
                return {
                    field : e.path[0], message : e.message
                }
            })
        }
    }
}
