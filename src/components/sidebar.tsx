
'use client';
import Link from "next/link"
import {
    Bell,
    CircleUser,
    Home,
    LineChart,
    Menu,
    Package,
    Package2,
    Search,
    ShoppingCart,
    Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeSwitcher from "./ThemeSwitcher";
import { usePathname } from "next/navigation";
import {
    ShieldCheckIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const pathname = usePathname();
    const navLinks = [
        { href: '/admin', icon: Home, text: 'Dashboard' },
        { href: '/admin/users', icon: Users, text: 'Users' },
        { href: '/admin/roles', icon: ShieldCheckIcon, text: 'Roles' },
        { href: '/admin/blogs', icon: DocumentTextIcon, text: 'Blogs' },
    ];

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">Admin Panel</span>
                    </Link>
                    <div className="ml-auto">
                    <ThemeSwitcher />
                    </div>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                                        isActive ? 'bg-muted text-primary' : ''
                                    }`}
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.text}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
