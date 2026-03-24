import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from './players/players.module';
import { ClubModule } from './club/club.module';
import { SquadModule } from './squad/squad.module';
import { ConfigModule } from '@nestjs/config';
import { ExternalFootballModule } from './external-football/external-football.module';
import { MatchesModule } from './matches/matches.module';
import { InjuriesModule } from './injuries/injuries.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExternalFootballModule,
    PlayersModule,
    ClubModule,
    SquadModule,
    MatchesModule,
    InjuriesModule,
    AnalyticsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
