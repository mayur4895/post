import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { postId: string } }) {
  if (!params.postId) {
    return NextResponse.json("postId not found", { status: 400 });
  }

  try {
    const comments = await db.comment.findMany({
      where: { postId: params.postId },
      include:{
        author:true
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
