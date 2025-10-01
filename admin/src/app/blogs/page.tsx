import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
    const res = await fetch('http://localhost:3000/api/v1/blogs', { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}

export default async function BlogsPage() {
    const blogs = await getBlogs();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Blogs</CardTitle>
                <CardDescription>A list of all the blogs in the database.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs.data.map((blog: any) => (
                            <TableRow key={blog._id}>
                                <TableCell>{blog.title}</TableCell>
                                <TableCell>{blog.author}</TableCell>
                                <TableCell>{blog.status}</TableCell>
                                <TableCell>{blog.views}</TableCell>
                                <TableCell>{blog.likes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
