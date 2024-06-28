"use client";
 

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
 
  FormField,
  FormItem,
  FormLabel,
 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
 
 
 
import { useRouter, useSearchParams } from "next/navigation";

import { Loader2 } from "lucide-react";
 
 
 
import Link from "next/link";
 
 
 
 
 
 
 
 
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { useToast } from "./ui/use-toast";
 
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { reset } from "@/app/actions/reset";
import ResetSchema from "@/app/schemas/ResetSchema";
 
  
 
const Reset = () => {
  const SearchParams = useSearchParams();
 
  
  
  const {toast} = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",  
    },
  });

  const isloding = form.formState.isSubmitting;
  async function onSubmit(values: z.infer<typeof ResetSchema>) {
    try {
      const res =  await  reset(values);
      
  
       if(res?.error){
         
        toast({
          variant:"destructive",
          title:res?.error, 
         })
  
         }

         if(res?.success && res.data){

           router.push(res.data.reset_password);


          toast({
            variant:"default",
            title: res?.success,
         
          })   
          

        }
       

        form.reset();
        router.refresh();  
  
    } catch (error) {
      console.log(error);
      toast({
        variant:"destructive",
        title: "Invalid User", 
       })
       form.reset();

    }
  }
 
  return (
    <>
   
        <Card className="px-8 py-5 w-max-[500px] w-[500px] mt-10">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>forgot your password</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              /> 
             
              <CardFooter className=" justify-between gap-3 flex-col w-full p-0">
                
              <Button type="submit" className=" h-10 w-full">
                  {isloding ? <Loader2 className=" animate-spin" /> : "submit"}
                </Button> 

              <Button  variant={"link"} className=" text-sm text-zinc-500">
                  {" "}
           
                  <Link href="/auth/login" className="  text-zinc-900">
                    {" "}
                    Back to login
                  </Link>
                </Button >
              </CardFooter>
            </form>
          </Form>
        </Card>
 
    </>
  );
};

export default Reset;
