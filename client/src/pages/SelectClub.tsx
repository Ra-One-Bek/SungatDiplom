import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  useSelectedClub,
  type SelectedClubId,
} from '../context/SelectedClubContext';
import { getSupportedClubs } from '../services/club';
import { clubThemes } from '../theme/clubThemes';

type SupportedClub = {
  id: SelectedClubId;
  name: string;
  shortName: string;
  league: string;
  season: number;
  teamId: number;
  leagueId: number;
  country: string;
  stadium?: string;
  founded?: number;
  logo?: string;
};

type ClubVisual = {
  bgImage: string;
  crowdLabel: string;
};

const clubVisuals: Record<SelectedClubId, ClubVisual> = {
  astana: {
    bgImage:
      'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.20), transparent 28%), linear-gradient(135deg, rgba(18,169,232,0.95), rgba(242,201,76,0.80))',
    crowdLabel: 'ASTANA FANS',
  },
  kairat: {
    bgImage:
      'repeating-linear-gradient(90deg, rgba(17,17,17,0.92) 0 28px, rgba(242,201,76,0.95) 28px 56px), linear-gradient(135deg, rgba(242,201,76,0.85), rgba(17,17,17,0.92))',
    crowdLabel: 'KAIRAT ULTRAS',
  },
  kaisar: {
    bgImage:
      'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.22), transparent 24%), linear-gradient(135deg, rgba(214,40,40,0.96), rgba(255,255,255,0.78))',
    crowdLabel: 'KAISAR RED WALL',
  },
};

export default function SelectClub() {
  const navigate = useNavigate();
  const { selectedClubId, setSelectedClubId } = useSelectedClub();

  const [clubs, setClubs] = useState<SupportedClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const pageRef = useRef<HTMLDivElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  const bgOverlayRef = useRef<HTMLDivElement | null>(null);
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const centerCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    async function loadClubs() {
      try {
        const data = await getSupportedClubs();
        setClubs(data);
      } catch (error) {
        console.error('Failed to load clubs:', error);
      } finally {
        setLoading(false);
      }
    }

    loadClubs();
  }, []);

  useEffect(() => {
    if (selectedClubId) {
      const index = clubs.findIndex((c) => c.id === selectedClubId);
      if (index >= 0) {
        setActiveIndex(index);
      }
    }
  }, [selectedClubId, clubs]);

  const safeIndex = useMemo(() => {
    if (!clubs.length) return 0;
    return ((activeIndex % clubs.length) + clubs.length) % clubs.length;
  }, [activeIndex, clubs.length]);

  const leftIndex = useMemo(() => {
    if (!clubs.length) return 0;
    return (safeIndex - 1 + clubs.length) % clubs.length;
  }, [safeIndex, clubs.length]);

  const rightIndex = useMemo(() => {
    if (!clubs.length) return 0;
    return (safeIndex + 1) % clubs.length;
  }, [safeIndex, clubs.length]);

  const activeClub = clubs[safeIndex];
  const leftClub = clubs[leftIndex];
  const rightClub = clubs[rightIndex];

  const activeTheme = activeClub ? clubThemes[activeClub.id] : null;
  const activeVisual = activeClub ? clubVisuals[activeClub.id] : null;

  useEffect(() => {
    if (!activeClub || !activeTheme || !activeVisual) return;

    gsap.fromTo(
      centerCardRef.current,
      { scale: 0.92, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    );

    gsap.fromTo(
      [logoRef.current, titleRef.current, metaRef.current, buttonRef.current],
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
      },
    );

    gsap.fromTo(
      leftCardRef.current,
      { opacity: 0, x: -30, scale: 0.7 },
      { opacity: 0.42, x: 0, scale: 0.8, duration: 0.6, ease: 'power2.out' },
    );

    gsap.fromTo(
      rightCardRef.current,
      { opacity: 0, x: 30, scale: 0.7 },
      { opacity: 0.42, x: 0, scale: 0.8, duration: 0.6, ease: 'power2.out' },
    );
  }, [activeClub, activeTheme, activeVisual]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const handleMove = (event: MouseEvent) => {
      const rect = page.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(bgLayerRef.current, {
        x: x * 36,
        y: y * 24,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.to(bgOverlayRef.current, {
        x: x * -18,
        y: y * -14,
        duration: 1.1,
        ease: 'power3.out',
      });

      gsap.to(logoRef.current, {
        x: x * 22,
        y: y * 16,
        rotationY: x * 10,
        rotationX: y * -10,
        transformPerspective: 1000,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.to(centerCardRef.current, {
        x: x * 12,
        y: y * 8,
        rotationY: x * 5,
        rotationX: y * -5,
        transformPerspective: 1000,
        duration: 0.9,
        ease: 'power3.out',
      });
    };

    const handleLeave = () => {
      gsap.to(
        [bgLayerRef.current, bgOverlayRef.current, logoRef.current, centerCardRef.current],
        {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          duration: 0.9,
          ease: 'power3.out',
        },
      );
    };

    page.addEventListener('mousemove', handleMove);
    page.addEventListener('mouseleave', handleLeave);

    return () => {
      page.removeEventListener('mousemove', handleMove);
      page.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  function animateSlide(direction: 'left' | 'right') {
    if (isAnimating || clubs.length < 2) return;
    setIsAnimating(true);

    const offset = direction === 'left' ? -120 : 120;

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex((prev) =>
          direction === 'left'
            ? (prev - 1 + clubs.length) % clubs.length
            : (prev + 1) % clubs.length,
        );
        setIsAnimating(false);
      },
    });

    tl.to(centerCardRef.current, {
      x: offset,
      scale: 0.92,
      opacity: 0.2,
      duration: 0.32,
      ease: 'power2.inOut',
    })
      .to(
        [leftCardRef.current, rightCardRef.current],
        {
          opacity: 0,
          duration: 0.18,
          ease: 'power2.out',
        },
        0,
      )
      .set(centerCardRef.current, { x: -offset })
      .to(centerCardRef.current, {
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 0.38,
        ease: 'power3.out',
      });
  }

  function handleSelect() {
    if (!activeClub) return;
    setSelectedClubId(activeClub.id);
    navigate('/club-intro');
    }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center overflow-hidden bg-slate-100">
        <div className="rounded-3xl bg-white px-8 py-6 text-lg font-semibold text-slate-600 shadow-lg">
          Загрузка клубов...
        </div>
      </div>
    );
  }

  if (!activeClub || !leftClub || !rightClub || !activeTheme || !activeVisual) {
    return null;
  }

  return (
    <div
      ref={pageRef}
      className="relative h-screen w-full overflow-hidden bg-slate-100"
      style={{ overflowX: 'hidden', overflowY: 'hidden' }}
    >
      <div
        ref={bgLayerRef}
        className="absolute inset-[-6%] scale-110 transition-all duration-700"
        style={{
          background: activeVisual.bgImage,
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0.18))]" />

      <div
        ref={bgOverlayRef}
        className="absolute inset-0 opacity-70"
        style={{
          background:
            activeClub.id === 'kairat'
              ? 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.35))'
              : 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(15,23,42,0.18))',
        }}
      />

      <div className="absolute left-1/2 top-10 z-10 -translate-x-1/2 text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.4em] text-white/80">
          Kazakhstan Premier League
        </p>
        <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
          Выберите клуб
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-white/80 md:text-lg">
          Персонализированный интерфейс, тема клуба, AI-аналитика состава и тренерский
          дашборд — всё под выбранную команду.
        </p>
      </div>

      <button
        onClick={() => animateSlide('left')}
        className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-5 py-4 text-3xl font-black text-white backdrop-blur-md transition hover:bg-white/20"
      >
        ‹
      </button>

      <button
        onClick={() => animateSlide('right')}
        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-5 py-4 text-3xl font-black text-white backdrop-blur-md transition hover:bg-white/20"
      >
        ›
      </button>

      <div className="relative z-10 flex h-full items-center justify-center px-6 pt-24">
        <div className="flex w-full max-w-7xl items-center justify-center gap-4 md:gap-10">
          <SideClubCard refProp={leftCardRef} club={leftClub} side="left" />
          <ActiveClubCard
            refProp={centerCardRef}
            logoRef={logoRef}
            titleRef={titleRef}
            metaRef={metaRef}
            buttonRef={buttonRef}
            club={activeClub}
            onSelect={handleSelect}
          />
          <SideClubCard refProp={rightCardRef} club={rightClub} side="right" />
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
          {activeVisual.crowdLabel}
        </p>
      </div>
    </div>
  );
}

function SideClubCard({
  club,
  side,
  refProp,
}: {
  club: SupportedClub;
  side: 'left' | 'right';
  refProp: React.RefObject<HTMLDivElement | null>;
}) {
  const theme = clubThemes[club.id];

  return (
    <div
      ref={refProp}
      className={`hidden rounded-[36px] border border-white/15 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl md:block ${
        side === 'left' ? '-rotate-6' : 'rotate-6'
      }`}
      style={{
        width: 230,
        height: 340,
        opacity: 0.42,
        transform: 'scale(0.8)',
      }}
    >
      <div className="flex h-full flex-col items-center justify-center text-center">
        {club.logo ? (
          <img
            src={club.logo}
            alt={club.name}
            className="h-24 w-24 object-contain opacity-95"
          />
        ) : (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-black"
            style={{ background: theme.gradient }}
          >
            {club.shortName}
          </div>
        )}

        <h3 className="mt-6 text-2xl font-black">{club.name}</h3>
        <p className="mt-3 text-sm uppercase tracking-[0.25em] text-white/70">
          {club.shortName}
        </p>
      </div>
    </div>
  );
}

function ActiveClubCard({
  club,
  onSelect,
  refProp,
  logoRef,
  titleRef,
  metaRef,
  buttonRef,
}: {
  club: SupportedClub;
  onSelect: () => void;
  refProp: React.RefObject<HTMLDivElement | null>;
  logoRef: React.RefObject<HTMLImageElement | null>;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  metaRef: React.RefObject<HTMLDivElement | null>;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const theme = clubThemes[club.id];

  return (
    <div
      ref={refProp}
      className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-[42px] border border-white/20 bg-white/12 px-8 py-10 text-center text-white shadow-[0_40px_120px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:px-10 md:py-12"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div
        className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl md:h-48 md:w-48"
        style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.22)' }}
      >
        {club.logo ? (
          <img
            ref={logoRef}
            src={club.logo}
            alt={club.name}
            className="h-28 w-28 object-contain md:h-36 md:w-36"
          />
        ) : (
          <div
            ref={logoRef as React.RefObject<HTMLDivElement>}
            className="flex h-28 w-28 items-center justify-center rounded-full text-3xl font-black md:h-36 md:w-36"
            style={{ background: theme.gradient }}
          >
            {club.shortName}
          </div>
        )}
      </div>

      <h2
        ref={titleRef}
        className="mt-8 text-4xl font-black tracking-tight md:text-5xl"
      >
        {club.name}
      </h2>

      <div
        ref={metaRef}
        className="mt-6 space-y-3 text-sm font-medium text-white/80"
      >
        <p className="uppercase tracking-[0.28em]">{club.shortName}</p>
        <p>{club.league}</p>
        <p>Сезон {club.season}</p>
        <p>{club.country}</p>
      </div>

      <button
        ref={buttonRef}
        onClick={onSelect}
        className="mt-8 w-full rounded-[22px] px-6 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.16)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        Выбрать клуб
      </button>
    </div>
  );
}