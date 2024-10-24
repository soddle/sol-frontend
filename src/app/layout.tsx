import "./globals.css";
import { MainLayoutClient } from "@/components/layout/mainLayoutClient";
import Providers from "@/components/providers";
import { satoshi } from "@/lib/fonts";

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
      <body
        className={`
          bg-[#181716] 
          bg-[url('/backgrounds/background_darkened_2.png')] 
          bg-cover 
          bg-center 
          bg-fixed 
          bg-no-repeat
          px-4
        `}
      >
        <Providers>
          <MainLayoutClient>{children}</MainLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
