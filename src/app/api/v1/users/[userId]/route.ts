import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/controllers/user.controller';
import { connectToDB } from '@/lib/db';

export const GET = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    await connectToDB();
    return getUserById(req, { params });
};

export const PUT = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    await connectToDB();
    return updateUser(req, { params });
};

export const DELETE = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    await connectToDB();
    return deleteUser(req, { params });
};
