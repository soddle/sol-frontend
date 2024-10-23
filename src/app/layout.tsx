import "./globals.css";
import { MainLayoutClient } from "@/components/layout/mainLayoutClient";
import Providers from "@/components/providers";
import { satoshi } from "@/lib/fonts";
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
      <body className="min-h-screen relative bg-[#181716]">
        <CyberpunkBackground />
        <div className="relative z-10 px-4">
          <Providers>
            <MainLayoutClient>{children}</MainLayoutClient>
          </Providers>
        </div>
      </body>
    </html>
  );
}
