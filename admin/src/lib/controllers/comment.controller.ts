import { NextRequest, NextResponse } from 'next/server';
import Comment from '@/lib/models/comment.model';
import Blog from '@/lib/models/blog.model';
import { ApiResponse } from '@/lib/apiResponses';

export const createComment = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const { content, author } = await req.json();

        const newComment = new (Comment as any)({
            content,
            author,
            blog: params.blogId
        });

        const savedComment = await newComment.save();

        await (Blog as any).findByIdAndUpdate(params.blogId, { $push: { comments: savedComment._id } });

        return NextResponse.json(new ApiResponse(201, savedComment, 'Comment created successfully'), { status: 201 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error creating comment'), { status: 500 });
    }
};
