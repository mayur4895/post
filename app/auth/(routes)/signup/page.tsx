 'use client'
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
 
import { useRouter, useSearchParams } from "next/navigation";

 
import { cn } from "@/lib/utils";
 
 
import Link from "next/link";
 
 
    
 
 
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
 
 
 
import { signIn } from "next-auth/react";  
import { FaSpinner } from "react-icons/fa"; 
import { useToast } from "@/components/ui/use-toast";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
 import {Loader2} from "lucide-react"
import RegisterSchema from "@/app/schemas/RegisterSchema";
import { register } from "@/app/actions/register";
 
const Signup = () => {
  const [isLoading,setisLoading] = useState(false);
  const SearchParams = useSearchParams();
  const urlError = SearchParams.get("error") === "OAuthAccountNotLinked";
  const {toast} = useToast(); 
   const router = useRouter();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const isloding = form.formState.isSubmitting;
  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    console.log(values)
    setisLoading(true);
    try {
      const res =  await  register(values)
       
      form.reset();
      if(res?.success){
        setisLoading(false)
        toast({
          variant:"default",
          title: res?.success,
       
        })   
         router.push("/login");
      }


      if(res?.error){
        setisLoading(false)
        toast({
          variant:"destructive",
          title:res.error,  
        })   
         
      }
      form.reset();
   
      router.refresh(); 
    } catch (error) {
      setisLoading(false)
      toast({
        variant:"destructive",
        title: "Something went wrong",
        description: "user already exists",
      })
      console.log(error);
    }
  }


  
 
  return (
    <>
 
      <div className=" flex h-[100vh] w-full justify-center items-center">
      <Card className="px-8 py-5 max-w-md w-full">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl">Signup</CardTitle>
            <CardDescription>Sign up to get started</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                disabled={isloding}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                disabled={isloding}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter Email"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                disabled={isloding}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter Password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

<CardFooter className=" justify-between gap-3 flex-col w-full p-0">
                <Button type="submit" className="h-10 w-full">
                  {isloding ? <Loader2 className=" animate-spin" /> : "Signup"}
                </Button>

                 
                <span className="text-sm text-zinc-500">
                  {" "}
                  You have already singup?
                  <Link href="/auth/login" className="text-zinc-800 font-semibold">
                    {" "}
                    login
                  </Link>
                </span>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Signup;
