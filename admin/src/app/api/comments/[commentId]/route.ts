import { NextRequest, NextResponse } from 'next/server';
import { updateComment, deleteComment } from '@/lib/controllers/comment.controller';
import { connectToDB } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { commentId: string } }) {
    await connectToDB();
    return updateComment(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { commentId: string } }) {
    await connectToDB();
    return deleteComment(req, { params });
}
