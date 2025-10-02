import { NextRequest, NextResponse } from 'next/server';
import { updateRole, deleteRole } from '@/lib/controllers/role.controller';
import { connectToDB } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { roleId: string } }) {
    await connectToDB();
    return updateRole(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { roleId: string } }) {
    await connectToDB();
    return deleteRole(req, { params });
}
