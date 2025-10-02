import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/apiResponses';
import { verifyToken } from '@/app/api/v1/utils/auth';

const unProtectedRoutes = ['/api/users/login', '/api/users/register'];

export async function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;
    const currentRoute = `${pathname}${search}`;

    if (unProtectedRoutes.includes(currentRoute)) {
        return NextResponse.next();
    }

    try {
        const token = req.headers.get('authorization')?.split(' ')?.[1];
        if (!token) {
            return NextResponse.json(new ApiResponse(401, null, 'No token provided'), { status: 401 });
        }

        const decoded = await verifyToken(token);

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', (decoded as any).id);
        requestHeaders.set('x-user-roles', JSON.stringify((decoded as any).roles));

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(new ApiResponse(401, { error: error.message }, 'Invalid or expired token'), { status: 401 });
    }
}

export const config = {
    matcher: '/api/:path*',
};
