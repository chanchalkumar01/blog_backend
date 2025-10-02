
'use client';

import { apiUrls } from '@/lib/apiUrls';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

async function getBlogs() {
    const res = await fetch(apiUrls.getBlogs, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadBlogs() {
            try {
                const blogsData = await getBlogs();
                setBlogs(blogsData.data);
            } catch (error: any) {
                setError(error.message);
            }
        }
        loadBlogs();
    }, []);

    const handleDelete = async (blogId: string) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                const res = await fetch(apiUrls.getBlogById(blogId), {
                    method: 'DELETE',
                });

                if (!res.ok) {
                    throw new Error('Failed to delete blog');
                }

                setBlogs(blogs.filter((blog) => blog._id !== blogId));
                alert('Blog deleted successfully!');
            } catch (error: any) {
                setError(error.message);
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Blogs</CardTitle>
                <CardDescription>A list of all the blogs in the database.</CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p className="text-red-500">Error: {error}</p>}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Likes</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs.map((blog: any) => (
                            <TableRow key={blog._id}>
                                <TableCell>{blog.title}</TableCell>
                                <TableCell>{blog.author}</TableCell>
                                <TableCell>{blog.status}</TableCell>
                                <TableCell>{blog.views}</TableCell>
                                <TableCell>{blog.likes}</TableCell>
                                <TableCell>
                                    <Link href={`/admin/blogs/${blog._id}/edit`} className="text-blue-500 hover:underline mr-2">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:underline">
                                        Delete
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
