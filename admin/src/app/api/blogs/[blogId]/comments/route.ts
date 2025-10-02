import { NextRequest, NextResponse } from 'next/server';
import { createComment, getCommentsForBlog } from '@/lib/controllers/comment.controller';
import { connectToDB } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: { blogId: string } }) {
    await connectToDB();
    return createComment(req, { params });
}

export async function GET(req: NextRequest, { params }: { params: { blogId: string } }) {
    await connectToDB();
    return getCommentsForBlog(req, { params });
}
