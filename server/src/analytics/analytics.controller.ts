import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('players-form')
  getPlayersForm() {
    return this.analyticsService.getPlayersForm();
  }

  @Get('players-form/:id')
  getPlayerFormById(@Param('id', ParseIntPipe) id: number) {
    return this.analyticsService.getPlayerFormById(id);
  }
}