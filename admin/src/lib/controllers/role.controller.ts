import { NextRequest, NextResponse } from 'next/server';
import Role from '@/lib/models/role.model';
import { ApiResponse } from '@/lib/apiResponses';

export const createRole = async (req: NextRequest) => {
    try {
        const { name } = await req.json();

        const existingRole = await (Role as any).findOne({ name });
        if (existingRole) {
            return NextResponse.json(new ApiResponse(409, null, 'Role already exists'), { status: 409 });
        }

        const newRole = new (Role as any)({ name });
        const savedRole = await newRole.save();

        return NextResponse.json(new ApiResponse(201, savedRole, 'Role created successfully'), { status: 201 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error creating role'), { status: 500 });
    }
};

export const getAllRoles = async (req: NextRequest) => {
    try {
        const roles = await (Role as any).find();
        return NextResponse.json(new ApiResponse(200, roles, 'Roles fetched successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error fetching roles'), { status: 500 });
    }
};

export const deleteRole = async (req: NextRequest, { params }: { params: { roleId: string } }) => {
    try {
        const result = await (Role as any).findByIdAndDelete(params.roleId);

        if (!result) {
            return NextResponse.json(new ApiResponse(404, null, 'Role not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, null, 'Role deleted successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error deleting role'), { status: 500 });
    }
};
