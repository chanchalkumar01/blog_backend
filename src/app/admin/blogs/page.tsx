
'use client';

import { apiUrls } from '@/lib/apiUrls';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

    if (error) {
        return (
          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-bold mb-4">Blogs</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        );
    }

    return (
        <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Blogs</h1>
                <Link href="/admin/blogs/create" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Create Blog
                </Link>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Author</th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Views</th>
                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Likes</th>
                            <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {blogs.map((blog: any) => (
                            <tr key={blog._id} className="hover:bg-gray-100 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-800">{blog.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{blog.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{blog.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{blog.views}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{blog.likes}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium space-x-4">
                                    <Link href={`/admin/blogs/${blog._id}/edit`} className="text-blue-600 hover:text-blue-800 font-semibold">
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(blog._id)} className="text-red-600 hover:text-red-800 font-semibold">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
