import { Navbar } from '@/components/layout/Navbar';

export function RouteLoading() {
  return <div className="min-h-[100dvh] bg-background text-primary">
    <Navbar />
    <main className="container mx-auto px-6 pb-16 pt-36 md:px-12" aria-busy="true">
      <p role="status" className="text-base">Opening the page…</p>
      <div className="mt-7 h-8 max-w-lg rounded bg-secondary" aria-hidden="true" />
      <div className="mt-4 h-4 max-w-xl rounded bg-secondary/70" aria-hidden="true" />
      <div className="mt-3 h-4 max-w-md rounded bg-secondary/70" aria-hidden="true" />
    </main>
  </div>;
}
