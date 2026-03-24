import Card from '../ui/Card';
import PlayerChip from './PlayerChip';

interface BenchPlayer {
  id: number;
  playerId?: number;
  name: string;
  position: string;
}

interface BenchListProps {
  title: string;
  players: BenchPlayer[];
  selectedItemId?: number | null;
  onSelectItem?: (itemId: number) => void;
}

export default function BenchList({
  title,
  players,
  selectedItemId,
  onSelectItem,
}: BenchListProps) {
  return (
    <Card>
      <h3 className="mb-4 text-lg font-bold text-white">{title}</h3>

      <div className="space-y-3">
        {players.map((player) => (
          <PlayerChip
            key={player.id}
            name={player.name}
            position={player.position}
            selected={selectedItemId === player.id}
            onClick={() => onSelectItem?.(player.id)}
          />
        ))}
      </div>
    </Card>
  );
}