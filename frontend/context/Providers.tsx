"use client";
import { RecoilRoot } from "recoil";
import * as React from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider, useSession } from "next-auth/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <RecoilRoot>{children}</RecoilRoot>
      </SessionProvider>

      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
};
