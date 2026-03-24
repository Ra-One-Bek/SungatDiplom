import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PlayersModule } from '../players/players.module';
import { InjuriesModule } from '../injuries/injuries.module';

@Module({
  imports: [PlayersModule, InjuriesModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}