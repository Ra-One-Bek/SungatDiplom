import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExternalFootballService } from '../external-football/external-football.service';

@Injectable()
export class ClubService {
  private readonly teamId: number;
  private readonly season: number;
  private readonly leagueId: number;

  constructor(
    private readonly externalFootballService: ExternalFootballService,
    private readonly configService: ConfigService,
  ) {
    this.teamId = Number(this.configService.get('ATLETICO_TEAM_ID'));
    this.season = Number(this.configService.get('CURRENT_SEASON'));
    this.leagueId = Number(this.configService.get('LA_LIGA_ID'));
  }

  async findClub() {
    const [teams, fixtures, standings] = await Promise.all([
      this.externalFootballService.getTeams(this.teamId),
      this.externalFootballService.getFixturesByTeam(
        this.teamId,
        this.season,
        this.leagueId,
      ),
      this.externalFootballService.getStandings(this.leagueId, this.season),
    ]);

    const teamData = teams[0];
    const team = teamData?.team;
    const venue = teamData?.venue;

    const finishedFixtures = fixtures.filter(
      (fixture: any) => fixture.fixture?.status?.short === 'FT',
    );

    const wins = finishedFixtures.filter((fixture: any) => {
      const goalsFor =
        fixture.teams.home.id === this.teamId
          ? fixture.goals.home
          : fixture.goals.away;
      const goalsAgainst =
        fixture.teams.home.id === this.teamId
          ? fixture.goals.away
          : fixture.goals.home;

      return goalsFor > goalsAgainst;
    }).length;

    const draws = finishedFixtures.filter((fixture: any) => {
      const goalsFor =
        fixture.teams.home.id === this.teamId
          ? fixture.goals.home
          : fixture.goals.away;
      const goalsAgainst =
        fixture.teams.home.id === this.teamId
          ? fixture.goals.away
          : fixture.goals.home;

      return goalsFor === goalsAgainst;
    }).length;

    const losses = finishedFixtures.length - wins - draws;

    const goalsScored = finishedFixtures.reduce((sum: number, fixture: any) => {
      return (
        sum +
        (fixture.teams.home.id === this.teamId
          ? fixture.goals.home || 0
          : fixture.goals.away || 0)
      );
    }, 0);

    const goalsConceded = finishedFixtures.reduce((sum: number, fixture: any) => {
      return (
        sum +
        (fixture.teams.home.id === this.teamId
          ? fixture.goals.away || 0
          : fixture.goals.home || 0)
      );
    }, 0);

    const cleanSheets = finishedFixtures.filter((fixture: any) => {
      const conceded =
        fixture.teams.home.id === this.teamId
          ? fixture.goals.away || 0
          : fixture.goals.home || 0;

      return conceded === 0;
    }).length;

    const recentMatches = finishedFixtures
      .slice(-5)
      .reverse()
      .map((fixture: any) => {
        const isHome = fixture.teams.home.id === this.teamId;
        const opponent = isHome ? fixture.teams.away.name : fixture.teams.home.name;

        const goalsFor = isHome ? fixture.goals.home : fixture.goals.away;
        const goalsAgainst = isHome ? fixture.goals.away : fixture.goals.home;

        let result: 'win' | 'draw' | 'loss' = 'draw';
        if (goalsFor > goalsAgainst) result = 'win';
        if (goalsFor < goalsAgainst) result = 'loss';

        return {
          id: fixture.fixture.id,
          opponent,
          competition: fixture.league.name,
          date: fixture.fixture.date,
          score: `${goalsFor} - ${goalsAgainst}`,
          result,
        };
      });

    const standingsBlock = standings?.[0]?.league?.standings?.[0] ?? [];
    const atleticoStanding = standingsBlock.find(
      (item: any) => item.team?.id === this.teamId,
    );

    return {
      info: {
        name: team?.name ?? 'Atletico de Madrid',
        country: team?.country ?? 'Spain',
        stadium: venue?.name ?? 'Unknown Stadium',
        coach: 'Unknown',
        founded: team?.founded ?? 1903,
        logo: team?.logo ?? '',
      },
      stats: {
        matchesPlayed: finishedFixtures.length,
        wins,
        draws,
        losses,
        goalsScored,
        goalsConceded,
        cleanSheets,
        averagePossession: 0,
        rank: atleticoStanding?.rank ?? null,
        points: atleticoStanding?.points ?? null,
      },
      recentMatches,
      topScorers: [],
    };
  }
}