import Container from "@/components/layout/container";
import Navigation from "./_components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen border-yellow-200">
      <Navigation />
      {children}
    </div>
  );
}
