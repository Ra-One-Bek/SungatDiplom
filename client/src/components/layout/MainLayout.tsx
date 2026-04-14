import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1700px]">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header />

          <main className="flex-1 px-4 pb-10 pt-6 md:px-6 xl:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}