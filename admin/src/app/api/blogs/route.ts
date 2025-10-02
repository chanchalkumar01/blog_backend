import { NextRequest, NextResponse } from 'next/server';
import { createBlog, getAllBlogs } from '@/lib/controllers/blog.controller';
import { connectToDB } from '@/lib/db';

export async function POST(req: NextRequest) {
    await connectToDB();
    return createBlog(req);
}

export async function GET(req: NextRequest) {
    await connectToDB();
    return getAllBlogs(req);
}
