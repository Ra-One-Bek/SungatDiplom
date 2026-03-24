import FieldPlayer from './FieldPlayer';

interface FieldPlayerData {
  id: number;
  playerId: number;
  name: string;
  role: string;
  top: string;
  left: string;
}

interface FootballFieldProps {
  players: FieldPlayerData[];
  selectedSlotId?: number | null;
  onSelectSlot?: (slotId: number) => void;
}

export default function FootballField({
  players,
  selectedSlotId,
  onSelectSlot,
}: FootballFieldProps) {
  return (
    <div className="relative h-[760px] w-full overflow-hidden rounded-[28px] border border-emerald-300/20 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 shadow-2xl">
      <div className="absolute inset-0 opacity-15">
        <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent_0%,transparent_10%,rgba(255,255,255,0.2)_10%,rgba(255,255,255,0.2)_20%,transparent_20%,transparent_30%,rgba(255,255,255,0.2)_30%,rgba(255,255,255,0.2)_40%,transparent_40%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_60%,transparent_60%,transparent_70%,rgba(255,255,255,0.2)_70%,rgba(255,255,255,0.2)_80%,transparent_80%,transparent_90%,rgba(255,255,255,0.2)_90%,rgba(255,255,255,0.2)_100%)]" />
      </div>

      <div className="absolute inset-6 rounded-[24px] border-2 border-white/80" />
      <div className="absolute left-1/2 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-white/80" />
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

      <div className="absolute left-1/2 top-6 h-28 w-72 -translate-x-1/2 border-2 border-t-0 border-white/80" />
      <div className="absolute left-1/2 top-6 h-12 w-32 -translate-x-1/2 border-2 border-t-0 border-white/80" />
      <div className="absolute left-1/2 top-[124px] h-3 w-3 -translate-x-1/2 rounded-full bg-white" />

      <div className="absolute bottom-6 left-1/2 h-28 w-72 -translate-x-1/2 border-2 border-b-0 border-white/80" />
      <div className="absolute bottom-6 left-1/2 h-12 w-32 -translate-x-1/2 border-2 border-b-0 border-white/80" />
      <div className="absolute bottom-[124px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white" />

      <div className="absolute left-1/2 top-0 h-3 w-36 -translate-x-1/2 rounded-b-md bg-white/90" />
      <div className="absolute bottom-0 left-1/2 h-3 w-36 -translate-x-1/2 rounded-t-md bg-white/90" />

      {players.map((player) => (
        <FieldPlayer
          key={player.id}
          name={player.name}
          role={player.role}
          top={player.top}
          left={player.left}
          selected={selectedSlotId === player.id}
          onClick={() => onSelectSlot?.(player.id)}
        />
      ))}
    </div>
  );
}