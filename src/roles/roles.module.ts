import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './roles.model';
import { UserRoles } from './user-roles.model';
import { User } from 'users';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    forwardRef(() => SequelizeModule.forFeature([Role, User, UserRoles])),
  ],
  exports: [RolesService],
})
export class RolesModule {}
