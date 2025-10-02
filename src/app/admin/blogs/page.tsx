
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
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <DocumentTextIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Blogs Management</h1>
        </div>
        <Link
          href="/admin/blogs/create"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create Blog
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-md mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Likes</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <p className="text-lg font-semibold">Loading blogs...</p>
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <p className="text-lg font-semibold">No blogs found.</p>
                </td>
              </tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{blog.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{blog.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{blog.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{blog.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{blog.likes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link href={`/admin/blogs/${blog._id}/edit`} className="text-primary hover:text-primary/90">
                      <PencilIcon className="h-5 w-5 inline-block" />
                    </Link>
                    <button onClick={() => handleDelete(blog._id)} className="text-red-600 hover:text-red-700">
                      <TrashIcon className="h-5 w-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
