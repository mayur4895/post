import { db } from "@/lib/db";
import { NextResponse } from "next/server";
interface ToggleLikeResponse {
  likeCount: number;
  likedByMe: boolean;
}

// Example logic to toggle like and update likeCount in your backend API
export async function POST(req: Request, { params }: { params: { postId: string } }) {
  if (!params.postId) {
    return NextResponse.json("postId not found", { status: 400 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json("UserId not provided", { status: 400 });
  }

  try {
    const existingLike = await db.like.findUnique({
      where: {
        postId_userId: {
          postId: params.postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // User already liked the post, so remove the like
      await db.like.delete({
        where: {
          postId_userId: {
            postId: params.postId,
            userId,
          },
        },
      });
    } else {
      // User hasn't liked the post, so create a new like
      await db.like.create({
        data: {
          userId,
          postId: params.postId,
        },
      });
    }

    // Update likeCount in the Post model after like/unlike
    const likeCount = await db.like.count({
      where: {
        postId: params.postId,
      },
    });

    // Update likeCount in the Post model
    await db.post.update({
      where: { id: params.postId },
      data: { likeCount },
    });

    const updatedPost = await db.post.findUnique({
      where: { id: params.postId },
      include: {
        likes: true,
      },
    });

    if (!updatedPost) {
      return NextResponse.json("Post not found", { status: 404 });
    }

    const likedByMe = !!existingLike;

    const response: ToggleLikeResponse = {
      likeCount: updatedPost.likeCount,  
      likedByMe,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
