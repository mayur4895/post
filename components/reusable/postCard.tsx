import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaTrash, FaComment, FaPen, FaRegComment } from 'react-icons/fa';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FiSend } from 'react-icons/fi';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useModal } from '@/hooks/use-modal-store';
import type { Post as PostType, Comment as CommentType } from '@prisma/client';
import { DeletePost } from '@/app/actions/post/DeletPost';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { CurrentUser } from '@/hooks/use-current-user';
import { LuSend ,LuShare2 } from "react-icons/lu";
 
interface ToggleLikeResponse {
  likeCount: number;
  likedByMe: boolean;
}

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
}

interface PostProps {
  post: PostType;
  userId: string | undefined;
}

const Post = ({ post, userId }: PostProps) => {
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likedByMe, setLikedByMe] = useState(false); // Initialize with false

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
 const currentUser = CurrentUser();
  const { onOpen } = useModal();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch post details including likes and comments
        const response = await axios.get(`/api/posts/${post.id}`);
        const postData = response.data;

        setLikeCount(postData.likeCount);
        setLikedByMe(postData.likedByMe);
        setComments(postData.comments);
      } catch (error) {
        console.error('Error fetching post data:', error);
      }
    };

    fetchPostData();
  }, [post.id, likedByMe]); 

  const handleToggleLike = async () => {
    try {
      if (!userId) return;
  
      const response = await axios.post(`/api/posts/${post.id}/toggleLike`, { userId });
      const { likeCount: newLikeCount, likedByMe: newLikedByMe } = response.data as ToggleLikeResponse;
  
      setLikeCount(newLikeCount);
      setLikedByMe((prevLikedByMe) => !prevLikedByMe); // Toggle likedByMe state
  
      localStorage.setItem(`likedPost_${post.id}`, JSON.stringify(newLikedByMe));
    } catch (error) {
      console.error('Error toggling like', error);
    }
  };
  

  const handleDelete = async () => {
   onOpen("deletePost",{Post: post})
  };

  const handleAddComment = async () => {
    try {
      if (!userId || !newComment) return;

      // Make API call to add a new comment
      const response = await axios.post(`/api/posts/${post.id}/addComment`, { userId, content: newComment });
      const addedComment = response.data;

      // Update comments state with the new comment
      setComments([addedComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleEdit = () => {
    onOpen('editPost', { Post: post });
  };

  useEffect(() => { 
    const likedStatus = localStorage.getItem(`likedPost_${post.id}`);
    if (likedStatus) {
      setLikedByMe(JSON.parse(likedStatus));
    }
  }, [post.id]);

  return (
    <div className="post-container w-full">
 
      <Card className='w-full'>
 
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {post.title}
          { post.authorId ==  currentUser?.id &&  <div className=' flex items-center gap-4 z-10'>
              <Button variant="outline" onClick={handleEdit}>
                <FaPen className="text-green-500" />
              </Button>
          <div>
          <Button variant="outline" onClick={handleDelete}>
                <FaTrash className="text-red-500" />
              </Button>
          </div>
            </div>}
          </CardTitle> 
        </CardHeader>
 
        <CardContent className=' w-full'>
          <img src={"/postimg.jpg"} alt='postImg'    className=' md:object-contain object-center lg:object-cover  w-auto lg:w-full  h-[300px] md::h-[400px]'/>
          <p>{post.content}</p>
        </CardContent>
 
        <CardFooter className="flex items-center justify-between gap-8">
 
          <button onClick={handleToggleLike} className="flex items-center gap-2">
            {likedByMe ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />} {likeCount}
          </button>
 
          <div className=' flex items-center gap-5'>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center   gap-2">
            <FaRegComment  />  <span className='text-xs'>{comments.length}</span>
          </button> 
          <button   >
            <LuSend  />  
          </button>
          <button  >
            <LuShare2  />  
          </button>
          </div>
        </CardFooter>
      </Card>

     
      {showComments && (
        <div className="mt-4 comments-section">
   
          <div className="comments-input-container flex items-center mb-4">
            <Input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="border flex-1 px-4"
            />
            <Button onClick={handleAddComment} variant="outline" className="ml-2">
              <FiSend size={18} />
            </Button>
          </div>

        
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start mb-4">
              {comment?.user?.image ? (
                <Image
                  src={comment.user.image}
                  alt={comment.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <div className="ml-2 flex-1">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <p className="font-bold">{comment?.user?.name}</p>
                  <p>{comment.content}</p>
                </div>
                <p className="text-gray-500 text-xs mt-1">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
