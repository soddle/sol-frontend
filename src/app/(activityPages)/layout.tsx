import Container from "@/components/layout/container";
import Navigation from "./_components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navigation />
      <div className="flex-grow overflow-auto">{children}</div>
    </div>
  );
}
