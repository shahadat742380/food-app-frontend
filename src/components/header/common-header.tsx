"use client";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { Typography } from "../typography";
import { useRouter } from "next/navigation";

const CommonHeader = ({ head_title }: { head_title: string }) => {
    const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-primary text-white h-16 flex items-center gap-4 px-6 py-3">
      <button onClick={() => router.back()} className="cursor-pointer">
        <ChevronLeft className="h-8 w-8" />
      </button>
      <Typography variant="Medium_H5" className="block !text-xl">
        {head_title}
      </Typography>
    </header>
  );
};

export default CommonHeader;
