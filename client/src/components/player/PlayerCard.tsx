import Card from '../ui/Card';
import Badge from '../ui/Badge';
import type { Player } from '../../types/player';

type LegacyPlayerCardProps = {
  name: string;
  number: number;
  position: string;
  nationality: string;
  form: number;
  image?: string;
  photo?: string;
};

type ModernPlayerCardProps = {
  player: Player;
};

type PlayerCardProps = ModernPlayerCardProps | LegacyPlayerCardProps;

function getFormVariant(form: number): 'success' | 'warning' | 'danger' {
  if (form >= 80) return 'success';
  if (form >= 60) return 'warning';
  return 'danger';
}

function isModernProps(props: PlayerCardProps): props is ModernPlayerCardProps {
  return 'player' in props;
}

export default function PlayerCard(props: PlayerCardProps) {
  const playerData = isModernProps(props)
    ? {
        name: props.player.name,
        number: props.player.number,
        position: props.player.position,
        nationality: props.player.nationality,
        form: props.player.form ?? 0,
        image:
          props.player.image ||
          props.player.photo ||
          'https://via.placeholder.com/80x80.png?text=Player',
        source: props.player.source,
      }
    : {
        name: props.name,
        number: props.number,
        position: props.position,
        nationality: props.nationality,
        form: props.form ?? 0,
        image:
          props.image ||
          props.photo ||
          'https://via.placeholder.com/80x80.png?text=Player',
        source: null,
      };

  return (
    <Card className="transition hover:border-red-500/40">
      <div className="flex items-center gap-4">
        <img
          src={playerData.image}
          alt={playerData.name}
          className="h-20 w-20 rounded-2xl object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">{playerData.name}</h3>
            <span className="text-sm font-semibold text-slate-400">
              #{playerData.number}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge text={playerData.position} />
            <Badge text={playerData.nationality} />
            <Badge
              text={`Form ${playerData.form}`}
              variant={getFormVariant(playerData.form)}
            />
            {playerData.source === 'admin' ? <Badge text="Local" /> : null}
            {playerData.source === 'hybrid' ? <Badge text="Edited" /> : null}
          </div>
        </div>
      </div>
    </Card>
  );
}