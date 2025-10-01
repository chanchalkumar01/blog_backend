import { createComment } from "@/lib/controllers/comment.controller";
import { NextRequest, NextResponse } from "next/server";

export const POST = createComment;