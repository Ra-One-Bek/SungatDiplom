import type { DragEvent } from 'react';

type BenchItem = {
  id: number;
  playerId?: number | null;
  name: string;
  position?: string;
};

type BenchListProps = {
  title: string;
  players: BenchItem[];
  selectedItemId: number | null;
  onSelectItem: (itemId: number) => void;
  sourceType?: 'bench' | 'reserves';
};

export default function BenchList({
  title,
  players,
  selectedItemId,
  onSelectItem,
  sourceType = 'bench',
}: BenchListProps) {
  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
    item: BenchItem,
  ) {
    const payload = JSON.stringify({
      sourceType,
      itemId: item.id,
    });

    event.dataTransfer.setData('text/plain', payload);
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
          {players.length}
        </span>
      </div>

      <div className="space-y-3">
        {players.map((player) => (
          <button
            key={player.id}
            type="button"
            draggable
            onDragStart={(event) => handleDragStart(event, player)}
            onClick={() => onSelectItem(player.id)}
            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
              selectedItemId === player.id
                ? 'border-[var(--club-primary)] bg-[var(--club-surface)]'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900">{player.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {player.position ?? 'Игрок'}
                </p>
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500 shadow-sm">
                drag
              </span>
            </div>
          </button>
        ))}

        {players.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
            Нет игроков
          </div>
        ) : null}
      </div>
    </div>
  );
}