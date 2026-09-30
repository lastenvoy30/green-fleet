import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)]">

      <Sidebar />

      <div className="min-h-screen pl-64">

        <Header />

        <main className="px-6 py-6">
          <div className="mx-auto w-full max-w-[1500px]">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}