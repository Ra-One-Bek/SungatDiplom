import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAdminPlayerDto } from './dto/create-admin-player.dto';
import { UpdateAdminPlayerDto } from './dto/update-admin-player.dto';
import { UpsertPlayerOverrideDto } from './dto/upsert-player-override.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  getAdminPlayers(clubId?: string, includeInactive = false) {
    return this.prisma.adminPlayer.findMany({
      where: {
        ...(clubId ? { clubId } : {}),
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { id: 'desc' },
    });
  }

  createAdminPlayer(dto: CreateAdminPlayerDto, userId: number) {
    return this.prisma.adminPlayer.create({
      data: {
        ...dto,
        createdById: userId,
      },
    });
  }

  async updateAdminPlayer(id: number, dto: UpdateAdminPlayerDto) {
    const existing = await this.prisma.adminPlayer.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Admin player not found');
    }

    return this.prisma.adminPlayer.update({
      where: { id },
      data: dto,
    });
  }

  async deactivateAdminPlayer(id: number) {
    const existing = await this.prisma.adminPlayer.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Admin player not found');
    }

    return this.prisma.adminPlayer.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async activateAdminPlayer(id: number) {
    const existing = await this.prisma.adminPlayer.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Admin player not found');
    }

    return this.prisma.adminPlayer.update({
      where: { id },
      data: { isActive: true },
    });
  }

  getPlayerOverrides(clubId?: string) {
    return this.prisma.playerOverride.findMany({
      where: clubId ? { clubId } : undefined,
      orderBy: { updatedAt: 'desc' },
    });
  }

  upsertPlayerOverride(dto: UpsertPlayerOverrideDto, userId: number) {
    return this.prisma.playerOverride.upsert({
      where: {
        externalPlayerId_clubId: {
          externalPlayerId: dto.externalPlayerId,
          clubId: dto.clubId,
        },
      },
      create: {
        ...dto,
        updatedById: userId,
      },
      update: {
        ...dto,
        updatedById: userId,
      },
    });
  }

  async getAdminLogs(limit = 50) {
    return this.prisma.adminActionLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        adminUser: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }
}