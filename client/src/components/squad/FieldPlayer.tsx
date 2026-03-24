interface FieldPlayerProps {
  name: string;
  role: string;
  top: string;
  left: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function FieldPlayer({
  name,
  role,
  top,
  left,
  selected = false,
  onClick,
}: FieldPlayerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
      style={{ top, left }}
    >
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold text-white shadow-lg transition ${
          selected
            ? 'border-yellow-300 bg-yellow-500'
            : 'border-white bg-red-600'
        }`}
      >
        {role}
      </div>
      <p className="mt-2 max-w-[90px] text-xs font-medium text-white">{name}</p>
    </button>
  );
}