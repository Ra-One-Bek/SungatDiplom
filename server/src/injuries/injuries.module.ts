import { Module } from '@nestjs/common';
import { InjuriesController } from './injuries.controller';
import { InjuriesService } from './injuries.service';
import { ExternalFootballModule } from '../external-football/external-football.module';

@Module({
  imports: [ExternalFootballModule],
  controllers: [InjuriesController],
  providers: [InjuriesService],
  exports: [InjuriesService],
})
export class InjuriesModule {}