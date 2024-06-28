import * as z from 'zod';


    const LoginSchema = z.object({
        username: z.string().min(1, {
          message:"required"
          }), 
    password: z.string().min(8, {
      message: "password must be at least 8 characters",
    }), 
  });


  export default LoginSchema;