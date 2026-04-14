import { Injectable, NotFoundException } from '@nestjs/common';
import { ExternalFootballService } from '../external-football/external-football.service';
import { KPL_CLUBS, SupportedClub } from '../data/kpl-clubs';

@Injectable()
export class ClubService {
  constructor(
    private readonly externalFootballService: ExternalFootballService,
  ) {}

  findAllSupportedClubs(): SupportedClub[] {
    return KPL_CLUBS;
  }

  findSupportedClubById(clubId: string): SupportedClub {
    const club = KPL_CLUBS.find((item) => item.id === clubId);

    if (!club) {
      throw new NotFoundException(`Club with id "${clubId}" not found`);
    }

    return club;
  }

  async findClub(clubId = 'astana') {
    const club = this.findSupportedClubById(clubId);

    const [teams, fixtures, standings] = await Promise.all([
      this.externalFootballService.getTeams(club.teamId),
      this.externalFootballService.getFixturesByTeam(
        club.teamId,
        club.season,
        club.leagueId,
      ),
      this.externalFootballService.getStandings(club.leagueId, club.season),
    ]);

    const teamData = teams[0];
    const team = teamData?.team;
    const venue = teamData?.venue;

    const finishedFixtures = fixtures.filter(
      (fixture: any) => fixture.fixture?.status?.short === 'FT',
    );

    const wins = finishedFixtures.filter((fixture: any) => {
      const goalsFor =
        fixture.teams.home.id === club.teamId ? fixture.goals.home : fixture.goals.away;
      const goalsAgainst =
        fixture.teams.home.id === club.teamId ? fixture.goals.away : fixture.goals.home;
      return goalsFor > goalsAgainst;
    }).length;

    const draws = finishedFixtures.filter((fixture: any) => {
      const goalsFor =
        fixture.teams.home.id === club.teamId ? fixture.goals.home : fixture.goals.away;
      const goalsAgainst =
        fixture.teams.home.id === club.teamId ? fixture.goals.away : fixture.goals.home;
      return goalsFor === goalsAgainst;
    }).length;

    const losses = finishedFixtures.length - wins - draws;

    const goalsScored = finishedFixtures.reduce((sum: number, fixture: any) => {
      return (
        sum +
        (fixture.teams.home.id === club.teamId
          ? fixture.goals.home || 0
          : fixture.goals.away || 0)
      );
    }, 0);

    const goalsConceded = finishedFixtures.reduce((sum: number, fixture: any) => {
      return (
        sum +
        (fixture.teams.home.id === club.teamId
          ? fixture.goals.away || 0
          : fixture.goals.home || 0)
      );
    }, 0);

    const cleanSheets = finishedFixtures.filter((fixture: any) => {
      const conceded =
        fixture.teams.home.id === club.teamId
          ? fixture.goals.away || 0
          : fixture.goals.home || 0;
      return conceded === 0;
    }).length;

    const recentMatches = finishedFixtures
      .slice(-5)
      .reverse()
      .map((fixture: any) => {
        const isHome = fixture.teams.home.id === club.teamId;
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
    const clubStanding = standingsBlock.find(
      (item: any) => item.team?.id === club.teamId,
    );

    return {
      selectedClub: {
        id: club.id,
        name: club.name,
        shortName: club.shortName,
        league: club.league,
        season: club.season,
        teamId: club.teamId,
        leagueId: club.leagueId,
      },
      info: {
        name: team?.name ?? club.name,
        country: team?.country ?? club.country,
        stadium: venue?.name ?? club.stadium ?? 'Unknown Stadium',
        coach: 'Unknown',
        founded: team?.founded ?? club.founded ?? null,
        logo: team?.logo ?? club.logo ?? '',
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
        rank: clubStanding?.rank ?? null,
        points: clubStanding?.points ?? null,
      },
      recentMatches,
      topScorers: [],
    };
  }

  async debugSearchTeams(name: string) {
    return this.externalFootballService.searchTeams(name);
  }

  async debugSearchLeagues(name: string) {
    return this.externalFootballService.searchLeagues(name);
  }
}