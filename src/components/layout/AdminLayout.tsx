interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="w-full">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
