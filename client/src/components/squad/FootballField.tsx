import FieldPlayer from './FieldPlayer';

type LineupSlot = {
  id: number;
  playerId: number | null;
  name?: string;
  role: string;
  top: string;
  left: string;
};

type FootballFieldProps = {
  players: LineupSlot[];
  selectedSlotId: number | null;
  onSelectSlot: (slotId: number) => void;
  onDragStartSlot?: (slotId: number) => void;
  onDropOnSlot?: (slotId: number, rawPayload: string) => void;
};

export default function FootballField({
  players,
  selectedSlotId,
  onSelectSlot,
  onDragStartSlot,
  onDropOnSlot,
}: FootballFieldProps) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900">Поле</h3>
        <p className="text-sm text-slate-500">
          Перетаскивай игроков между позициями
        </p>
      </div>

      <div className="relative h-[620px] overflow-hidden rounded-[28px] border border-emerald-800 bg-emerald-700 shadow-inner">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/40" />
        <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50" />
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />

        <div className="absolute left-1/2 top-[86%] h-[110px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-t-[140px] border border-white/40" />
        <div className="absolute left-1/2 top-[14%] h-[110px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-b-[140px] border border-white/40" />

        <div className="absolute left-1/2 top-[90%] h-[54px] w-[110px] -translate-x-1/2 -translate-y-1/2 border border-white/40" />
        <div className="absolute left-1/2 top-[10%] h-[54px] w-[110px] -translate-x-1/2 -translate-y-1/2 border border-white/40" />

        {players.map((slot) => (
          <FieldPlayer
            key={slot.id}
            id={slot.id}
            name={slot.name ?? 'Empty'}
            role={slot.role}
            top={slot.top}
            left={slot.left}
            isSelected={selectedSlotId === slot.id}
            onClick={onSelectSlot}
            onDragStart={onDragStartSlot}
            onDropPlayer={onDropOnSlot}
          />
        ))}
      </div>
    </div>
  );
}