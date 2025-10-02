import { NextRequest, NextResponse } from 'next/server';
import Comment from '@/lib/models/comment.model';
import Blog from '@/lib/models/blog.model';
import { ApiResponse } from '@/lib/apiResponses';

export const createComment = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const { content, author } = await req.json();

        const newComment = new Comment({
            content,
            author,
            blog: params.blogId
        });

        const savedComment = await newComment.save();

        await Blog.findByIdAndUpdate(params.blogId, { $push: { comments: savedComment._id } });

        return NextResponse.json(new ApiResponse(201, savedComment, 'Comment created successfully'), { status: 201 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error creating comment'), { status: 500 });
    }
};

export const getCommentsForBlog = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const comments = await Comment.find({ blog: params.blogId }).populate('author', 'username');
        return NextResponse.json(new ApiResponse(200, comments, 'Comments fetched successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error fetching comments'), { status: 500 });
    }
};

export const updateComment = async (req: NextRequest, { params }: { params: { commentId: string } }) => {
    try {
        const { content } = await req.json();
        const updatedComment = await Comment.findByIdAndUpdate(params.commentId, { content }, { new: true });

        if (!updatedComment) {
            return NextResponse.json(new ApiResponse(404, null, 'Comment not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, updatedComment, 'Comment updated successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error updating comment'), { status: 500 });
    }
};

export const deleteComment = async (req: NextRequest, { params }: { params: { commentId: string } }) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(params.commentId);

        if (!deletedComment) {
            return NextResponse.json(new ApiResponse(404, null, 'Comment not found'), { status: 404 });
        }

        await Blog.findByIdAndUpdate(deletedComment.blog, { $pull: { comments: deletedComment._id } });

        return NextResponse.json(new ApiResponse(200, null, 'Comment deleted successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error deleting comment'), { status: 500 });
    }
};
