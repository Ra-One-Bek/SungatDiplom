import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { GetAnalyticsQueryDto } from './dto/get-analytics-query.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('players-form')
  getPlayersForm(@Query() query: GetAnalyticsQueryDto) {
    return this.analyticsService.getPlayersForm(query.clubId ?? 'astana');
  }

  @Get('players-form/:id')
  getPlayerFormById(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetAnalyticsQueryDto,
  ) {
    return this.analyticsService.getPlayerFormById(
      id,
      query.clubId ?? 'astana',
    );
  }
}