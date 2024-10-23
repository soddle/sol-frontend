import "./globals.css";
import { MainLayoutClient } from "@/components/layout/mainLayoutClient";
import Providers from "@/components/providers";
import { satoshi } from "@/lib/fonts";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import CyberpunkBackground from "./cyberpunkBackground";

export const metadata = {
  title: "Soddle",
  description: "Soddle game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${satoshi.variable}`}>
      <body className="bg-[#181716] px-4">
        <CyberpunkBackground />
        <Providers>
          <MainLayoutClient>{children}</MainLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
