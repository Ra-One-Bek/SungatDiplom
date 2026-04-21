type Player = {
  id: number;
  name: string;
};

type SetPieceKey = 'penalty' | 'freeKick' | 'corner' | 'captain';

type SetPiecesType = {
  penalty: number | null;
  freeKick: number | null;
  corner: number | null;
  captain: number | null;
};

type Props = {
  players: Player[];
  setPieces: SetPiecesType;
  onChange: (key: SetPieceKey, playerId: number) => void;
};

export default function SetPiecesPanel({
  players,
  setPieces,
  onChange,
}: Props) {
  function renderSelect(label: string, key: SetPieceKey) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-600">{label}</p>

        <select
          value={setPieces[key] ?? ''}
          onChange={(e) => onChange(key, Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2"
        >
          <option value="">Не выбран</option>
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <h3 className="text-lg font-black text-slate-900">
        Стандарты и роли
      </h3>

      {renderSelect('Пенальти', 'penalty')}
      {renderSelect('Штрафные', 'freeKick')}
      {renderSelect('Угловые', 'corner')}
      {renderSelect('Капитан', 'captain')}
    </div>
  );
}