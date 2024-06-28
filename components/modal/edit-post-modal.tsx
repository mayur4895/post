'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
 

import { Input } from "@/components/ui/input"
import qs from "query-string"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
 
import {  useToast } from "../ui/use-toast"
 import axios from "axios"  
import {  useParams, useRouter } from "next/navigation"
import { useModal } from '../../hooks/use-modal-store';
 
import queryString from "query-string"
import { formSchema } from "./create-post-modal"
import { Textarea } from "../ui/textarea"
 


 
const EditPostModal = ()=>{
  const { isOpen, onClose, type, data ,} = useModal(); 

  const {Post:post} = data;
  const isModalOpen = isOpen && type==="editPost"; 
const {toast} = useToast();
 const router = useRouter();
 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title:"",
        content:""
        
    },
  })

  useEffect(() => {
    if (post) {       

      form.setValue("title", post?.title); 
      form.setValue( "content", post?.content);
    }
  }, [form,post]);

  const isloding = form.formState.isSubmitting;
   async function onSubmit(values: z.infer<typeof formSchema>) {
      
   try {
     
     const url = qs.stringifyUrl({
      url:`/api/posts/${post?.id}`,
      query:{
        userId: post?.authorId
      }

     })
     await axios.patch(url,values)
     form.reset();
     router.refresh();
     toast({
        variant: 'default',
        title: 'Post edited successfully',
      })
      window.location.reload();
     onClose();
   
   } catch (error) {
     toast({
      variant:"destructive",
      title:"Something went wrong"
   
     })
   }
  }

 
 
 const handleClose = ()=>{
  form.reset;
  onClose();
 }
 
    return(<>
    <Dialog open={isModalOpen} onOpenChange={handleClose} >
  <DialogContent className=" outline-none">
    <DialogHeader>
      <DialogTitle className="text-2xl">Edit POst</DialogTitle>
    </DialogHeader>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">   

     
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel >Post Title</FormLabel>
              <FormControl>
                <Input disabled={isloding} className="outline-none  focus:outline-none " placeholder="Enter Server Name" {...field} />
              </FormControl> 
              <FormMessage  className="text-xs text-rose-500"/>
            </FormItem>
          )}
        />
 <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl> 
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" >Save</Button>
      </form>
    </Form>
  </DialogContent>
 
</Dialog>

    </>) 
}


export default EditPostModal;