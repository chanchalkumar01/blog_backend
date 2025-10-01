import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/lib/models/blog.model';
import { ApiResponse } from '@/lib/apiResponses';

export const createBlog = async (req: NextRequest) => {
    try {
        const { title, content, author } = await req.json();

        const newBlog = new Blog({
            title,
            content,
            author
        });

        const savedBlog = await newBlog.save();

        return NextResponse.json(new ApiResponse(201, savedBlog, 'Blog created successfully'), { status: 201 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error creating blog'), { status: 500 });
    }
};

export const getAllBlogs = async (req: NextRequest) => {
    try {
        const blogs = await Blog.find();
        return NextResponse.json(new ApiResponse(200, blogs, 'Blogs fetched successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error fetching blogs'), { status: 500 });
    }
};

export const getBlogById = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const blog = await Blog.findById(params.blogId);
        if (!blog) {
            return NextResponse.json(new ApiResponse(404, null, 'Blog not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, blog, 'Blog fetched successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error fetching blog'), { status: 500 });
    }
};

export const updateBlog = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const { title, content } = await req.json();
        const updatedBlog = await Blog.findByIdAndUpdate(params.blogId, { title, content }, { new: true });

        if (!updatedBlog) {
            return NextResponse.json(new ApiResponse(404, null, 'Blog not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, updatedBlog, 'Blog updated successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error updating blog'), { status: 500 });
    }
};

export const deleteBlog = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const result = await Blog.findByIdAndDelete(params.blogId);

        if (!result) {
            return NextResponse.json(new ApiResponse(404, null, 'Blog not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, null, 'Blog deleted successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error deleting blog'), { status: 500 });
    }
};
