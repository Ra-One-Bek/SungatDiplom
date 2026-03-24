import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { ExternalFootballModule } from '../external-football/external-football.module';

@Module({
  imports: [ExternalFootballModule],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}