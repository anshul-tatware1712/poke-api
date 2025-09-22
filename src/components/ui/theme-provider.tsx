"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      enableSystem={true}
      storageKey="pokeapi-theme"
      defaultTheme="system"
      attribute="class"
      themes={["dark", "light"]}
      disableTransitionOnChange={true}
    >
      {children}
    </NextThemesProvider>
  );
}
