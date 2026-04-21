import type { CSSProperties, DragEvent } from 'react';

type FieldPlayerProps = {
  id: number;
  name: string;
  role: string;
  top: string;
  left: string;
  isSelected?: boolean;
  onClick?: (slotId: number) => void;
  onDragStart?: (slotId: number) => void;
  onDropPlayer?: (slotId: number, rawPayload: string) => void;
};

export default function FieldPlayer({
  id,
  name,
  role,
  top,
  left,
  isSelected = false,
  onClick,
  onDragStart,
  onDropPlayer,
}: FieldPlayerProps) {
  const style: CSSProperties = {
    position: 'absolute',
    top,
    left,
    transform: 'translate(-50%, -50%)',
  };

  function handleDragStart(event: DragEvent<HTMLButtonElement>) {
    const payload = JSON.stringify({
      sourceType: 'lineup',
      slotId: id,
    });

    event.dataTransfer.setData('text/plain', payload);
    event.dataTransfer.effectAllowed = 'move';
    onDragStart?.(id);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    const payload = event.dataTransfer.getData('text/plain');
    if (!payload) return;
    onDropPlayer?.(id, payload);
  }

  function handleDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => onClick?.(id)}
      style={style}
      className={`group min-w-[86px] rounded-2xl border px-3 py-2 text-center shadow-lg transition ${
        isSelected
          ? 'border-[var(--club-primary)] bg-white ring-4 ring-sky-100'
          : 'border-white/70 bg-white/90 hover:bg-white'
      }`}
    >
      <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
        {role}
      </div>
      <div className="mt-1 text-sm font-bold text-slate-900">{name}</div>
    </button>
  );
}