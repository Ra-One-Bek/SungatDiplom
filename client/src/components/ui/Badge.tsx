interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
}

const badgeClasses = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  neutral: 'bg-slate-700/40 text-slate-300 border-slate-600',
};

export default function Badge({ text, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses[variant]}`}
    >
      {text}
    </span>
  );
}