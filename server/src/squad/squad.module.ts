import { Module } from '@nestjs/common';
import { SquadController } from './squad.controller';
import { SquadService } from './squad.service';

@Module({
  controllers: [SquadController],
  providers: [SquadService],
  exports: [SquadService],
})
export class SquadModule {}