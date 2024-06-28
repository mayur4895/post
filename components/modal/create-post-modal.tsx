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

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
 
import {  useToast } from "../ui/use-toast"
 import axios from "axios"  

import { useModal } from '../../hooks/use-modal-store';
import { Textarea } from "../ui/textarea"
import { createPost } from "@/app/actions/post/CreatePost"
import { CurrentUser } from "@/hooks/use-current-user"
import { useRouter } from "next/navigation"
 
 
 




export const formSchema = z.object({
    title: z.string().min(2).max(50),
     content: z
    .string()
    .min(10, {
      message: "content must be at least 10 characters.",
    })
    .max(160, {
      message: "content must not be longer than 30 characters.",
    }), 
})

const CreatePostModal = ()=>{
  const {isOpen,onClose,type} = useModal();
 const currentUser = CurrentUser();
  const isModalOpen = isOpen && type==="createPost";
const {toast} = useToast();
 const router  = useRouter()
 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title:"",
        content:"",
    
    },
  })

  const isloding = form.formState.isSubmitting;
   async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try {

        if(!currentUser?.id) return;
        const response = await axios.post('/api/post', {
            title: values.title,
            content: values.content, 
           authorId:  currentUser.id, 
        });
        toast({
          variant: 'default',
          title: 'Post created successfully',
        });
        console.log(response);
        onClose();
     
        router.push('/posts');  
        window.location.reload();
      } catch (error) {
        console.error('Error creating post:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to create post',
          description: 'An error occurred while creating the post.',
        });
      }
    };
 

 
 
 const handleClose = ()=>{
  form.reset;
  onClose();
 }
 
    return(<>
    <Dialog open={isModalOpen} onOpenChange={handleClose} >
  <DialogContent className=" outline-none">
    <DialogHeader>
      <DialogTitle className="text-2xl">Create your Post</DialogTitle>
      <DialogDescription>
        You can edit the post after, just create post.
      </DialogDescription>
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
                <Input disabled={isloding} className="outline-none  focus:outline-none " placeholder="Enter Title" {...field} />
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
        <Button type="submit"  >Submit</Button>
      </form>
    </Form>
  </DialogContent>
 
</Dialog>

    </>) 
}


export default CreatePostModal;