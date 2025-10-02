import { NextRequest, NextResponse } from 'next/server';
import Blog from '@/lib/models/blog.model';
import { ApiResponse } from '@/lib/apiResponses';
import { slugify } from '../utils/slugify';

export const createBlog = async (req: NextRequest) => {
    try {
        const { title, content, author, short_description } = await req.json();

        const newBlog = new Blog({
            title,
            content,
            author,
            short_description
        });

        const savedBlog = await newBlog.save();

        return NextResponse.json(new ApiResponse(201, savedBlog, 'Blog created successfully'), { status: 201 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error creating blog'), { status: 500 });
    }
};

export const getAllBlogs = async (req: NextRequest) => {
    try {
        const blogs = await Blog.find().populate('author', 'username');
        return NextResponse.json(new ApiResponse(200, blogs, 'Blogs fetched successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error fetching blogs'), { status: 500 });
    }
};

export const getBlogById = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const blog = await Blog.findById(params.blogId).populate('author', 'username');
        if (!blog) {
            return NextResponse.json(new ApiResponse(404, null, 'Blog not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, blog, 'Blog fetched successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error fetching blog'), { status: 500 });
    }
};

export const updateBlog = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const { title, content, short_description } = await req.json();
        const updatedBlog = await Blog.findByIdAndUpdate(params.blogId, { title, content, short_description, slug: slugify(title) }, { new: true, runValidators: true });

        if (!updatedBlog) {
            return NextResponse.json(new ApiResponse(404, null, 'Blog not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, updatedBlog, 'Blog updated successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error updating blog'), { status: 500 });
    }
};

export const deleteBlog = async (req: NextRequest, { params }: { params: { blogId: string } }) => {
    try {
        const result = await Blog.findByIdAndDelete(params.blogId);

        if (!result) {
            return NextResponse.json(new ApiResponse(404, null, 'Blog not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, null, 'Blog deleted successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error deleting blog'), { status: 500 });
    }
};
