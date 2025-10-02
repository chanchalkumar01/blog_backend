import { NextRequest, NextResponse } from 'next/server';
import { createRole, getAllRoles } from '@/lib/controllers/role.controller';
import { connectToDB } from '@/lib/db';

export async function POST(req: NextRequest) {
    await connectToDB();
    return createRole(req);
}

export async function GET(req: NextRequest) {
    await connectToDB();
    return getAllRoles(req);
}
