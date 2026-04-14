import { Controller, Get, Query } from '@nestjs/common';
import { InjuriesService } from './injuries.service';
import { GetInjuriesQueryDto } from './dto/get-injuries-query.dto';

@Controller('injuries')
export class InjuriesController {
  constructor(private readonly injuriesService: InjuriesService) {}

  @Get()
  findAll(@Query() query: GetInjuriesQueryDto) {
    return this.injuriesService.findAll(query.clubId ?? 'astana');
  }
}