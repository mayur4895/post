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

export async function PATCH(req: Request, res: NextApiResponse, { params }: { params: { postId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const { title, content } = await req.json();

    if (!userId) {
      return res.status(400).json("userId not provided");
    }

    if (!params?.postId) {
      return res.status(400).json("postId not provided");
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

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json("Internal Server Error");
  }
}

 

export async function DELETE(req: NextApiRequest, res: NextApiResponse, { params }: { params: { postId: string } }) {
  try {
    if (!params?.postId) {
      return res.status(400).json("postId not provided");
    }

    await db.post.delete({ where: { id: params.postId } });

    return res.status(200).json("post deleted");
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json("Internal Server Error");
  }
}

 

 

export async function GET(req: NextApiRequest, res: NextApiResponse, { params }: { params: { postId: string } }) {
  try {
    const sessionUser = await auth();
    if (!sessionUser) {
      return res.status(401).json("Unauthorized");
    }

    if (!params.postId) {
      return res.status(400).json("postId not provided");
    }

    const post = await db.post.findUnique({
      where: { id: params.postId },
      include: { likes: true, author: true, comments: { include: { author: true } } }
    });

    if (!post) {
      return res.status(404).json("Post not found");
    }

    const likedByMe = post.likes.some((like) => like.userId === sessionUser?.user?.id);
    return res.status(200).json({ ...post, likedByMe });
  } catch (error) {
    console.error('Error fetching post:', error);
    return res.status(500).json("Internal Server Error");
  }
}
