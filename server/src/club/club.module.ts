import { Module } from '@nestjs/common';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { ExternalFootballModule } from '../external-football/external-football.module';

@Module({
  imports: [ExternalFootballModule],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}