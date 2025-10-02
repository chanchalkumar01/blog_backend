
import Sidebar from '@/components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
