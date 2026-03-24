import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { SquadModule } from '../squad/squad.module';
import { PlayersModule } from '../players/players.module';

@Module({
  imports: [AnalyticsModule, SquadModule, PlayersModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}