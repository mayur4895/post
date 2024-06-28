 
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PostCard from './reusable/postCard';
import { Post } from '@prisma/client';
import { CurrentUser } from '@/hooks/use-current-user';
import { BeatLoader } from 'react-spinners';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { useModal } from '@/hooks/use-modal-store';
 




 
const Allposts = () => {
 

 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = CurrentUser();
  const {onOpen} = useModal();
    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const response = await axios.get('/api/post'); 
            console.log(response.data);
            
            setPosts(response.data);
          } catch (error) {
            console.error("Error fetching posts:", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchPosts();
      }, []);
    
      if (loading) {
        return  <div className=' fixed top-0 left-0 w-full bg-white-50 h-full '>
           <div className=' flex items-center justify-center h-full w-full'>
                   <Loader2 size={25}  className=' animate-spin'/>
              </div> 
        </div>
 
      }
  return (
    <div> 
    {posts.length === 0 ? (
       <div className=' fixed top-8 left-0 w-full bg-white-50 h-full  z-0'>
       <div className=' flex items-center justify-center h-full w-full'>
          <div className=' items-center text-center flex flex-col gap-4'>
          <Image alt='l' src={"/add.png"} height={80} width={80} className=' opacity-25  object-center object-cover' />
          <Button onClick={()=>{onOpen('createPost')}} className='text-center'> Create Post</Button>
            </div>
          </div> 
    </div>

    ) : (
      <ul>
        {posts.map(post => (
         <PostCard   
           post={post}
           userId={currentUser?.id}
         />
        ))}
      </ul>
    )}
  </div>
  )
}

export default Allposts
