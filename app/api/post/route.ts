// app/api/post/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const posts = await db.post.findMany({
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
      likes:true
    },
  });

  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { title, content, authorId } = await request.json();
  const newPost = await db.post.create({
    data: {
      title,
      content,
      author: { connect: { id: authorId } },   
    },
  });

  return NextResponse.json(newPost);
}
