import type { Player } from '../../types/player';
import Card from '../ui/Card';

type SetPieceKey = 'penalty' | 'freeKick' | 'corner' | 'captain';

type Props = {
  players: Player[];
  setPieces: {
    penalty: number | null;
    freeKick: number | null;
    corner: number | null;
    captain: number | null;
  };
  onChange: (key: SetPieceKey, playerId: number | null) => void;
};

export default function SetPiecesPanel({
  players,
  setPieces,
  onChange,
}: Props) {
  const selectablePlayers = players.filter(
    (player) => player.externalPlayerId !== null,
  );

  function renderSelect(label: string, key: SetPieceKey) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">{label}</label>

        <select
          value={setPieces[key] ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            onChange(key, value ? Number(value) : null);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
        >
          <option value="">Не выбран</option>

          {selectablePlayers.map((player) => (
            <option key={player.id} value={player.externalPlayerId ?? ''}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-black text-slate-900">
        Стандарты и роли
      </h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {renderSelect('Пенальти', 'penalty')}
        {renderSelect('Штрафные', 'freeKick')}
        {renderSelect('Угловые', 'corner')}
        {renderSelect('Капитан', 'captain')}
      </div>
    </Card>
  );
}