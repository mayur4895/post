// Import necessary modules and Prisma Client
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// Middleware for authentication
const getSessionUser = async (req: NextApiRequest) => {
  const session = await auth();
  return session?.user ?? null;
};

// PATCH endpoint for updating a post
export async function PATCH(req: Request, { params }: { params: { postId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const { title, content } = await req.json();

    if (!userId) {
        return  NextResponse.json("userId not provided",{status:400}); 
    }

    if (!params?.postId) {
        return  NextResponse.json("postId not provided",{status:400}); 
    }

    const user = await db.user.update({
      where: { id: userId },
      data: {
        posts: {
          update: {
            where: { id: params?.postId },
            data: { title, content }
          }
        }
      }
    });

    return  NextResponse.json(user,{status:200}); 
  } catch (error) {
    console.error('Error updating post:', error);
    return { error: 'Internal Server Error', status: 500 };
  }
}

// DELETE endpoint for deleting a post
export async function DELETE(req: NextApiRequest, { params }: { params: { postId: string } }) {
  try {
    if (!params?.postId) {
      return  NextResponse.json("postId not provided",{status:400}); 
    }

    await db.post.delete({ where: { id: params.postId } });

    return  NextResponse.json("post deleted",{status:200}); 
  } catch (error) {
    
    return  NextResponse.json("Internal server error",{status:500}); 
  }
}

 
export async function GET(req: Request, { params }: { params: { postId: string } }) {
 
    const sessionUser = await auth();
    if (!sessionUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
  if (!params.postId) {
    return  NextResponse.json("postId not provided",{status:400}); 
  }
        
  
 

  try {
    const post = await db.post.findUnique({
      where: { id: params.postId as string },
      include: { likes: true, author: true, comments: { include: { author: true } } }
    });

    if (!post) {
        return  NextResponse.json("post not  found",{status:400}); 
    }

    const likedByMe = post.likes.some((like) => like.userId === sessionUser?.user?.id);
    return  NextResponse.json({ ...post, likedByMe },{status:200}); 
    
  } catch (error) {
    console.error('Error fetching post:', error);
    return  NextResponse.json("Internal server error",{status:500}); 
  }
}
