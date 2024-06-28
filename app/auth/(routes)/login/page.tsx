"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import LoginSchema from "@/app/schemas/LoginSchema";
import { login } from "@/app/actions/login";
import Link from "next/link";

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    console.log(values);
    setIsLoading(true);
    try {
      const res = await login(values);
      form.reset();
      if (res?.success) {
        setIsLoading(false);
        toast({
          variant: "default",
          title: res?.success,
        });
        router.push("/posts");
        window.location.reload();
      } else if (res?.error) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: res.error,
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "An unexpected error occurred",
      });
      console.log(error);
    }
  }

  return (
    <div className="flex h-[100vh] w-full justify-center items-center">
      <Card className="px-8 py-5 max-w-md w-full">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Username" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter Password" {...field} />
                  </FormControl>
                  <Button variant={"link"} asChild><Link href="/auth/reset" className="pl-0 font-normal text-xs">Forgot your password ?</Link></Button>
                </FormItem>
              )}
            />
            <CardFooter className="justify-between gap-3 flex-col w-full p-0">
              <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
              <span className="text-sm text-zinc-500">
                You don't have an account?
                <Link href="/auth/signup" className="text-zinc-800 font-semibold">
                  Sign up
                </Link>
              </span>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Signin;
