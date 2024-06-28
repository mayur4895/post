import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  if (!params.postId) {
    return NextResponse.json("postId not found", { status: 400 });
  }

  const { userId, content } = await req.json();

  if (!userId || !content) {
    return NextResponse.json("UserId or content not provided", { status: 400 });
  }

  try {
    const comment = await db.comment.create({
      data: {
        content,
        postId: params.postId,
         authorId:userId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
