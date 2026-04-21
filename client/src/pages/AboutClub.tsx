import { useMemo } from 'react';
import { useSelectedClub } from '../context/SelectedClubContext';
import SectionTitle from '../components/ui/SectionTitle';
import { clubAboutContent } from '../theme/clubThemes';

export default function AboutClub() {
  const { selectedClubId, currentTheme } = useSelectedClub();

  const content = useMemo(() => {
    if (!selectedClubId) return null;
    return clubAboutContent[selectedClubId];
  }, [selectedClubId]);

  if (!selectedClubId || !content || !currentTheme) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section
        className="relative overflow-hidden rounded-[36px] p-8 text-white shadow-xl md:p-12"
        style={{ background: 'var(--club-gradient)' }}
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

        <div className="relative max-w-4xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-white/80">
            About Club
          </p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            {content.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/90">
            Эта страница специально сделана длинной и визуально насыщенной, чтобы
            показать персонализированный дизайн под выбранный клуб КПЛ и усилить
            презентацию дипломного проекта.
          </p>
        </div>
      </section>

      <SectionTitle
        title={`О клубе — ${currentTheme.name}`}
        subtitle="История, идентичность и контекст команды"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Город
          </p>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {content.city}
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Основан
          </p>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {content.founded}
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Стадион
          </p>
          <p className="mt-3 text-2xl font-black text-slate-900">
            {content.stadium}
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900">История клуба</h3>
          <div className="mt-6 space-y-5">
            {content.history.map((item, index) => (
              <div
                key={index}
                className="timeline-item rounded-2xl bg-slate-50 p-5"
              >
                <p className="text-base leading-8 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900">
              Идентичность клуба
            </h3>
            <div className="mt-6 space-y-4">
              {content.identity.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-5"
                  style={{ backgroundColor: 'var(--club-surface)' }}
                >
                  <p className="leading-8 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900">
              Амбиции и цели
            </h3>
            <div className="mt-6 space-y-4">
              {content.ambition.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 p-5"
                >
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: 'var(--club-primary)' }}
                  />
                  <p className="font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="p-8 md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">
              Why this matters
            </p>
            <h3 className="mt-4 text-3xl font-black text-slate-900">
              Почему этот раздел важен для платформы
            </h3>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Этот раздел формирует целостное восприятие системы и помогает
              пользователю быстрее ориентироваться в контексте клуба. Вместо
              разрозненных данных интерфейс объединяет аналитику, визуальную
              идентичность и структуру команды в единое пространство принятия
              решений.
            </p>
          </div>

          <div
            className="flex items-center justify-center p-10 text-white"
            style={{ background: 'var(--club-gradient)' }}
          >
            <div className="max-w-md text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/80">
                KPL Experience
              </p>
              <h4 className="mt-4 text-4xl font-black">
                Персонализированный интерфейс под выбранный клуб
              </h4>
              <p className="mt-6 text-lg leading-8 text-white/90">
                Интерфейс адаптируется под конкретный клуб, его визуальный стиль и
                контекст работы. Это позволяет тренеру, аналитикам и менеджерам
                работать в среде, отражающей структуру команды и упрощающей
                ежедневные задачи управления составом.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}