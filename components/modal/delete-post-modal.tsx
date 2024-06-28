'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
 
import qs from "query-string"
 
 
 
import {  useToast } from "../ui/use-toast"
 import axios from "axios"  
import {  useParams, useRouter } from "next/navigation"
import { useModal } from '../../hooks/use-modal-store';
 
 
 

 
const DeletePost = ()=>{
  const {isOpen,onClose,type,data} = useModal();
  const {Post:post} = data;
   

  
  const isModalOpen = isOpen && type==="deletePost";
const {toast} = useToast();
 const router = useRouter();
  

 
   async function onDelete() {
      
 
        try {
          const response = await axios.delete(`/api/posts/${post?.id}`);
          console.log('Deleted post:', response.data);
          window.location.reload(); // Refresh the page after deleting
        } catch (error) {
          console.error('Error deleting post:', error);
        }
 
    }
  
 const handleClose = ()=>{
  onClose();
 }
 
    return(<>
  <Dialog open={isModalOpen} onOpenChange={handleClose}>
      
      <DialogContent  >
        <DialogHeader>
          <DialogTitle className="text-2xl">Are you sure to Delete Post?</DialogTitle>
          <DialogDescription>
              This action cannot be undone.
              <span className="text-blue-400"> '{post?.title } ' </span> post
              permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center">
          <Button onClick={()=>{onClose()}}>Cancel</Button>
          <Button onClick={()=>{onDelete()}} variant={"outline"}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>) 
}


export default DeletePost;