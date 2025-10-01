import { getBlogById, updateBlog, deleteBlog } from "@/lib/controllers/blog.controller";
import { NextRequest, NextResponse } from "next/server";

export const GET = getBlogById;
export const PUT = updateBlog;
export const DELETE = deleteBlog;
