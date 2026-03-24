interface FormationSelectorProps {
  value: string;
  onChange: (formation: string) => void;
}

const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'];

export default function FormationSelector({
  value,
  onChange,
}: FormationSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {formations.map((formation) => (
        <button
          key={formation}
          onClick={() => onChange(formation)}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
            value === formation
              ? 'border-red-500 bg-red-600 text-white'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
          }`}
        >
          {formation}
        </button>
      ))}
    </div>
  );
}