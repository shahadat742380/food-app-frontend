"use client";

import Logo from "@/assets/logo";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "../Sidebar";
import Link from "next/link";
import { SearchBar } from "../SearchBar";

interface HeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (term: string) => void;
}

export const Header = ({
  searchValue = "",
  onSearchChange = () => {},
  onSearch = () => {},
}: HeaderProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  console.log(isSearchExpanded);

  return (
    <>
      <header className="sticky top-0 z-50 bg-primary text-white h-16 ">
        {isSearchExpanded ? (
          <SearchBar
            value={searchValue}
            onChange={(value) => {
              onSearchChange(value);
            }}
            onSearch={(term) => {
              onSearch(term);
            }}
            onBackClick={() => setIsSearchExpanded(false)}
          />
        ) : (
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <div
                className="cursor-pointer"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-8 w-8" />
              </div>
              <Link href="/">
                <Logo />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div
                onClick={() => setIsSearchExpanded(true)}
                className=" cursor-pointer"
              >
                <Search />
              </div>

              <Link
                href="/cart"
                className="text-white hover:bg-primary-foreground/20 p-2 rounded-full"
              >
                <ShoppingCart className="h-6 w-6" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};
