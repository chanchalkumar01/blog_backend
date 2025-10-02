import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/lib/models/user.model';
import Role from '@/lib/models/role.model';
import { ApiResponse } from '@/lib/apiResponses';
import mongoose from 'mongoose';

// Helper to validate ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const registerUser = async (req: NextRequest) => {
    try {
        const { username, email, password, roles } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json(new ApiResponse(400, null, 'Username, email, and password are required'), { status: 400 });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json(new ApiResponse(409, null, 'Username or email already exists'), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let roleIds = [];
        if (roles && roles.length > 0) {
            const foundRoles = await Role.find({ name: { $in: roles } });
            if (foundRoles.length !== roles.length) {
                return NextResponse.json(new ApiResponse(400, null, 'One or more roles not found'), { status: 400 });
            }
            roleIds = foundRoles.map(role => role._id);
        } else {
            const defaultRole = await Role.findOne({ name: 'user' });
            if (defaultRole) {
                roleIds.push(defaultRole._id);
            }
        }

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            roles: roleIds,
        });

        const savedUser = await newUser.save();
        savedUser.password = undefined;

        return NextResponse.json(new ApiResponse(201, savedUser, 'User registered successfully'), { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(new ApiResponse(400, (error as any).errors, 'Invalid user data'), { status: 400 });
        }
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error creating user'), { status: 500 });
    }
};

export const loginUser = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();
        const user = await User.findOne({ email }).populate('roles').select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id, roles: user.roles.map((role: any) => role.name) },
                process.env.JWT_SECRET!,
                { expiresIn: '1d' }
            );
            return NextResponse.json(new ApiResponse(200, { token }, 'Login successful'), { status: 200 });
        } else {
            return NextResponse.json(new ApiResponse(401, null, 'Invalid credentials'), { status: 401 });
        }
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error logging in'), { status: 500 });
    }
};

export const getAllUsers = async (req: NextRequest) => {
    try {
        const users = await User.find().populate('roles', 'name').select('-password');
        return NextResponse.json(new ApiResponse(200, users, 'Users fetched successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error fetching users'), { status: 500 });
    }
};

export const getUserById = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        if (!isValidObjectId(params.userId)) {
            return NextResponse.json(new ApiResponse(400, null, 'Invalid user ID'), { status: 400 });
        }

        const user = await User.findById(params.userId).populate('roles', 'name').select('-password');
        if (!user) {
            return NextResponse.json(new ApiResponse(404, null, 'User not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, user, 'User fetched successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error fetching user'), { status: 500 });
    }
};

export const updateUser = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        if (!isValidObjectId(params.userId)) {
            return NextResponse.json(new ApiResponse(400, null, 'Invalid user ID'), { status: 400 });
        }

        const { username, email, password } = await req.json();
        const updateData: any = {};

        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            params.userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json(new ApiResponse(404, null, 'User not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, updatedUser, 'User updated successfully'), { status: 200 });
    } catch (error) {
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(new ApiResponse(400, (error as any).errors, 'Invalid user data'), { status: 400 });
        }
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error updating user'), { status: 500 });
    }
};

export const deleteUser = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        if (!isValidObjectId(params.userId)) {
            return NextResponse.json(new ApiResponse(400, null, 'Invalid user ID'), { status: 400 });
        }

        const result = await User.findByIdAndDelete(params.userId);
        if (!result) {
            return NextResponse.json(new ApiResponse(404, null, 'User not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, null, 'User deleted successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error deleting user'), { status: 500 });
    }
};

export const assignRoles = async (req: NextRequest, { params }: { params: { userId: string } }) => {
    try {
        if (!isValidObjectId(params.userId)) {
            return NextResponse.json(new ApiResponse(400, null, 'Invalid user ID'), { status: 400 });
        }

        const { roles } = await req.json();
        if (!Array.isArray(roles) || roles.some(roleId => !isValidObjectId(roleId))) {
            return NextResponse.json(new ApiResponse(400, null, 'Roles must be an array of valid role IDs'), { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            params.userId,
            { $set: { roles: roles } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json(new ApiResponse(404, null, 'User not found'), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, updatedUser, 'User roles updated successfully'), { status: 200 });
    } catch (error) {
        return NextResponse.json(new ApiResponse(500, { error: (error as Error).message }, 'Error updating user roles'), { status: 500 });
    }
};
