import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, registerUser } from '@/lib/controllers/user.controller';
import { connectToDB } from '@/lib/db';

export const GET = async (req: NextRequest) => {
    await connectToDB();
    return getAllUsers(req);
};

export const POST = async (req: NextRequest) => {
    await connectToDB();
    return registerUser(req);
};
