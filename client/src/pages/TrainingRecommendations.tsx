import { useEffect, useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Card from '../components/ui/Card';
import {
  getTrainingRecommendations,
  type TrainingRecommendationItem,
} from '../services/ai';

export default function TrainingRecommendations() {
  const [items, setItems] = useState<TrainingRecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrainingData() {
      try {
        const data = await getTrainingRecommendations();
        setItems(data);
      } catch (error) {
        console.error('Failed to load training recommendations:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTrainingData();
  }, []);

  if (loading) {
    return <p className="text-slate-300">Загрузка рекомендаций...</p>;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Рекомендации по тренировкам"
        subtitle="AI-оценка нагрузки, фокуса и состояния игроков"
      />

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <Card key={item.playerId}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {item.position} · Форма: {item.formScore}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Фокус: {item.focus}
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Нагрузка: {item.load}
                </p>
              </div>

              <div className="max-w-xl rounded-2xl bg-slate-950 p-4">
                <p className="text-sm font-semibold text-slate-300">Причина</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.reason}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}