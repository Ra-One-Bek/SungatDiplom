import { Controller, Get } from '@nestjs/common';
import { InjuriesService } from './injuries.service';

@Controller('injuries')
export class InjuriesController {
  constructor(private readonly injuriesService: InjuriesService) {}

  @Get()
  findAll() {
    return this.injuriesService.findAll();
  }
}