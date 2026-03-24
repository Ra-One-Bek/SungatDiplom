interface PlayerStatRowProps {
  label: string;
  value: string | number;
}

export default function PlayerStatRow({ label, value }: PlayerStatRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-3 last:border-b-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}