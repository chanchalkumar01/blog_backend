
'use client';

import { apiUrls } from '@/lib/apiUrls';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const blogsData = await getBlogs();
        setBlogs(blogsData.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
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
    <div className="bg-surface rounded-lg shadow-lg p-6" style={{ background: 'var(--surface)' }}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <DocumentTextIcon className="h-8 w-8 mr-4 text-primary" />
          <h1 className="text-3xl font-extrabold text-primary">Blogs</h1>
        </div>
        <Link
          href="/admin/blogs/create"
          className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create Blog
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead style={{ background: 'var(--primary-light)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Author</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Views</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white uppercase">Likes</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-white uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {blogs.map((blog: any) => (
                <tr key={blog._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-foreground">{blog.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{blog.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{blog.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{blog.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-md text-gray-600">{blog.likes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-md font-medium space-x-4">
                    <Link href={`/admin/blogs/${blog._id}/edit`} className="text-primary hover:text-primary-dark">
                      <PencilIcon className="h-5 w-5 inline" />
                    </Link>
                    <button onClick={() => handleDelete(blog._id)} className="text-red-600 hover:text-red-800">
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
