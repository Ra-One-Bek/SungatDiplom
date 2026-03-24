export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            Atletico de Madrid Manager
          </h1>
          <p className="text-sm text-slate-400">
            Анализ игроков, клуба и состава
          </p>
        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300">
          Demo UI
        </div>
      </div>
    </header>
  );
}