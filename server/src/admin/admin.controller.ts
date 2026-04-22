import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAccessGuard } from '../auth/jwt-access.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateAdminPlayerDto } from './dto/create-admin-player.dto';
import { UpdateAdminPlayerDto } from './dto/update-admin-player.dto';
import { UpsertPlayerOverrideDto } from './dto/upsert-player-override.dto';

@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('players/local')
  getAdminPlayers(
    @Query('clubId') clubId?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.adminService.getAdminPlayers(clubId, includeInactive === 'true');
  }

  @Post('players/local')
  createAdminPlayer(
    @Body() dto: CreateAdminPlayerDto,
    @CurrentUser() user: { sub: number },
  ) {
    return this.adminService.createAdminPlayer(dto, user.sub);
  }

  @Patch('players/local/:id')
  updateAdminPlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdminPlayerDto,
  ) {
    return this.adminService.updateAdminPlayer(id, dto);
  }

  @Delete('players/local/:id')
  deactivateAdminPlayer(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deactivateAdminPlayer(id);
  }

  @Patch('players/local/:id/restore')
  activateAdminPlayer(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.activateAdminPlayer(id);
  }

  @Get('players/overrides')
  getPlayerOverrides(@Query('clubId') clubId?: string) {
    return this.adminService.getPlayerOverrides(clubId);
  }

  @Post('players/overrides')
  upsertPlayerOverride(
    @Body() dto: UpsertPlayerOverrideDto,
    @CurrentUser() user: { sub: number },
  ) {
    return this.adminService.upsertPlayerOverride(dto, user.sub);
  }

    @Get('logs')
    getAdminLogs(@Query('limit') limit?: string) {
      const parsedLimit = limit ? Number(limit) : 50;
      return this.adminService.getAdminLogs(Number.isNaN(parsedLimit) ? 50 : parsedLimit);
    }
}