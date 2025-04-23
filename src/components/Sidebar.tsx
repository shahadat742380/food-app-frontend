"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Typography } from "./typography";
import { ChevronRight, History, Heart, LogOut } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogTitle } from "./ui/dialog";
import avatar from "@/assets/images/avater.png";
import Link from "next/link";
import { useState } from "react";
import LogoutDialog from "./modal/logout-dialog";
import { authClient } from "@/lib/auth-client";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { data: session } = authClient.useSession();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    onClose(); // Close the sidebar when logout is clicked
    setIsLogoutDialogOpen(true);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[300px] p-0">
          <DialogTitle></DialogTitle>
          <div className="flex flex-col h-full">
            {/* Profile Section */}
            <div className="px-6 pt-2">
              <div className="space-y-0">
                <div className="relative w-20 h-20">
                  <Image
                    src={avatar}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="mt-3">
                  <Typography variant="SemiBold_H5" className="text-foreground block">
                  {session?.user?.name}
                  </Typography>
                  <Typography
                    variant="Regular_H6"
                    className="text-muted-foreground block"
                  >
                    {session?.user?.email}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 space-y-3 mt-8">
              <MenuItem
                icon={<History className="w-6 h-6 text-primary" />}
                label="Order History"
                href="/order-history"
              />
              <MenuItem
                icon={<Heart className="w-6 h-6 text-primary" />}
                label="Favorite"
                href="/favorites"
              />
              <MenuItem
                icon={<LogOut className="w-6 h-6 text-primary" />}
                label="Log out"
                onClick={handleLogout}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {setIsLogoutDialogOpen && (
        <Dialog
          modal
          onOpenChange={setIsLogoutDialogOpen}
          open={isLogoutDialogOpen}
        >
          <LogoutDialog setClose={setIsLogoutDialogOpen} />
        </Dialog>
      )}
    </>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const MenuItem = ({
  icon,
  label,
  className,
  href,
  onClick,
  disabled,
}: MenuItemProps) => {
  // If there's an onClick handler, it's an action item, not a link
  if (onClick) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-6 py-2 hover:bg-accent cursor-pointer focus-visible:outline-none focus-visible:border-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <Typography variant="Regular_H5">{label}</Typography>
        </div>
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>
    );
  }

  // Otherwise, it's a navigation link
  return (
    <Link
      href={href || "#"}
      className={`w-full flex items-center justify-between px-6 py-2 hover:bg-accent cursor-pointer ${className}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <Typography variant="Regular_H5">{label}</Typography>
      </div>
      <ChevronRight className="w-6 h-6 text-primary" />
    </Link>
  );
};
