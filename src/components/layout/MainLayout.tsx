import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen max-w-[400px] mx-auto bg-gray-50">
      <main className="h-full">{children}</main>
    </div>
  );
}
