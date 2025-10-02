import { NextRequest, NextResponse } from 'next/server';
import { getBlogById, updateBlog, deleteBlog } from '@/lib/controllers/blog.controller';
import { connectToDB } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { blogId: string } }) {
    await connectToDB();
    return getBlogById(req, { params });
}

export async function PUT(req: NextRequest, { params }: { params: { blogId: string } }) {
    await connectToDB();
    return updateBlog(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { blogId: string } }) {
    await connectToDB();
    return deleteBlog(req, { params });
}
