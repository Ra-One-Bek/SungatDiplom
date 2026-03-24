import { Module } from '@nestjs/common';
import { ExternalFootballService } from './external-football.service';

@Module({
  providers: [ExternalFootballService],
  exports: [ExternalFootballService],
})
export class ExternalFootballModule {}