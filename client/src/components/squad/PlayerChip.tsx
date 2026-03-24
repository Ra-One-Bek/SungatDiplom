interface PlayerChipProps {
  name: string;
  position: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function PlayerChip({
  name,
  position,
  selected = false,
  onClick,
}: PlayerChipProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border px-3 py-3 text-left transition ${
        selected
          ? 'border-red-500 bg-red-500/10'
          : 'border-slate-700 bg-slate-900 hover:border-slate-500'
      }`}
    >
      <p className="font-semibold text-white">{name}</p>
      <p className="mt-1 text-sm text-slate-400">{position}</p>
    </button>
  );
}