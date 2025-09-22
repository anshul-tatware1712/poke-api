"use client";

import React from "react";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container w-full mx-auto px-4 py-3 flex justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">Pokémon Labs</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
