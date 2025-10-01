import { createBlog, getAllBlogs } from "@/lib/controllers/blog.controller";
import { NextRequest, NextResponse } from "next/server";

export const POST = createBlog;
export const GET = getAllBlogs;
