import CyberpunkNav from "./_components/cyberpunkNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen ">
      <CyberpunkNav />
      <div className="flex-grow overflow-auto">{children}</div>
    </div>
  );
}
