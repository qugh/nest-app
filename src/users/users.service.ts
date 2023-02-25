import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue('user');
    await user.$set('roles', [role.id]);
    user.roles = [role];
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }

  async addRoleToUser(dto: AddRoleDto) {
    try {
      const { value, email } = dto;
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user)
        throw new HttpException(
          'Пользователь с таким email не существует',
          HttpStatus.NOT_FOUND,
        );

      const role = await this.rolesService.getRoleByValue(value);

      if (!value)
        throw new HttpException(
          `Роль "${role.value}" не существует`,
          HttpStatus.NOT_FOUND,
        );

      await user.$add('role', role.id);
      user.roles = [role];
      return user;
    } catch (e) {
      throw new HttpException(
        e.message || 'Что-то пошло не так',
        e.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async banUser(dto: BanUserDto) {
    try {
      const { userId, banReason } = dto;

      const user = await this.userRepository.findByPk(userId);
      if (!user)
        throw new HttpException(
          'Пользователь с таким id не существует',
          HttpStatus.NOT_FOUND,
        );

      if (user.isBanned) {
        throw new HttpException(
          `Пользователь уже забанен${
            banReason ? `, по причине: ${banReason}` : ''
          }`,
          HttpStatus.BAD_REQUEST,
        );
      }

      user.isBanned = true;
      user.banReason = banReason;
      await user.save();
      return user;
    } catch (e) {
      throw new HttpException(
        e.message || 'Что-то пошло не так',
        e.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
