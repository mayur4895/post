// utils/toggleLike.ts
'use server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const toggleLike = async (postId: string, userId: string) => {
  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    // Unlike the post
    await prisma.like.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
  } else {
    // Like the post
    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }

  // Return the updated post with the new like count
  const updatedPost = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      likes: true,
    },
  });

  return {
    ...updatedPost,
    likeCount: updatedPost?.likes.length,
    likedByMe: !existingLike,
  };
};
