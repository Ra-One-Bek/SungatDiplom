import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('recommendations/squad')
  getSquadRecommendations() {
    return this.aiService.getSquadRecommendations();
  }

  @Get('recommendations/bench-options/:slotId')
  getBenchOptions(@Param('slotId', ParseIntPipe) slotId: number) {
    return this.aiService.getBenchOptionsForSlot(slotId);
  }

  @Get('recommendations/training')
  getTrainingRecommendations() {
    return this.aiService.getTrainingRecommendations();
  }

  @Get('recommendations/role-alerts')
  getRoleAlerts() {
    return this.aiService.getRoleAlerts();
  }
}