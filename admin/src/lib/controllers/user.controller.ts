import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/user.model';
import Role from '@/lib/models/role.model';
import { ApiResponse } from '@/lib/apiResponses';

export const registerUser = async (req: NextRequest) => {
    try {
        const { username, email, password, roles } = await req.json();

        const existingUser = await (User as any).findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json(new ApiResponse(409, null, 'Username or email already exists'), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let roleIds = [];
        if (roles && roles.length > 0) {
            const foundRoles = await (Role as any).find({ name: { $in: roles } });
            if (foundRoles.length !== roles.length) {
                return NextResponse.json(new ApiResponse(400, null, 'One or more roles not found'), { status: 400 });
            }
            roleIds = foundRoles.map((role: any) => role._id);
        }

        const newUser = new (User as any)({
            username,
            email,
            password: hashedPassword,
            roles: roleIds,
        });

        const savedUser = await newUser.save();
        savedUser.password = undefined;

        return NextResponse.json(new ApiResponse(201, savedUser, 'User registered successfully'), { status: 201 });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            return NextResponse.json(new ApiResponse(400, error.errors, 'Invalid user data'), { status: 400 });
        }
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error creating user'), { status: 500 });
    }
};

export const loginUser = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();
        const user = await (User as any).findOne({ email }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
                expiresIn: '1d',
            });
            return NextResponse.json(new ApiResponse(200, { token }, 'Login successful'), { status: 200 });
        } else {
            return NextResponse.json(new ApiResponse(401, null, 'Invalid credentials'), { status: 401 });
        }
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error logging in'), { status: 500 });
    }
};

export const assignRoles = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        const { roles } = await req.json();
        if (!Array.isArray(roles)) {
            return NextResponse.json(new ApiResponse(400, null, 'Roles must be an array of role IDs'), { status: 400 });
        }

        const updatedUser = await (User as any).findByIdAndUpdate(
            params.userId,
            { $set: { roles: roles } },
            { new: true } 
        );

        if (!updatedUser) {
            return NextResponse.json(new ApiResponse(404, null, 'User not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, null, 'User roles updated successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error updating user roles'), { status: 500 });
    }
};

export const getAllUsers = async (req: NextRequest) => {
    try {
        const users = await (User as any).find().select('-password');
        return NextResponse.json(new ApiResponse(200, users, 'Users fetched successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error fetching users'), { status: 500 });
    }
};

export const getUserById = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        const user = await (User as any).findById(params.userId).select('-password');

        if (!user) {
            return NextResponse.json(new ApiResponse(404, null, 'User not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, user, 'User fetched successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error fetching user'), { status: 500 });
    }
};

export const deleteUser = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        const result = await (User as any).findByIdAndDelete(params.userId);

        if (!result) {
            return NextResponse.json(new ApiResponse(404, null, 'User not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, null, 'User deleted successfully'), { status: 200 });
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(500, { error: error.message }, 'Error deleting user'), { status: 500 });
    }
};
