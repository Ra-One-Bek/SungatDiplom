import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminPlayerDto } from './create-admin-player.dto';

export class UpdateAdminPlayerDto extends PartialType(CreateAdminPlayerDto) {}