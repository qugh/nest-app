import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';
import { Role } from '../roles/roles.model';
import { User } from '../users';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new UnauthorizedException('Токен отсутствует');

      const headerArr = authHeader.split(' ');
      const bearer = headerArr[0];
      const token = headerArr[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const user: User = this.jwtService.verify(token);
      req.user = user;

      const isRoleValid = user.roles.some((role: Role) =>
        requiredRoles.includes(role.value),
      );

      if (!isRoleValid)
        throw new HttpException(
          'У вас недостаточно прав для данного действия',
          HttpStatus.FORBIDDEN,
        );

      return true;
    } catch (e) {
      throw new HttpException(
        e.message || 'У вас недостаточно прав для данного действия',
        e.status || HttpStatus.FORBIDDEN,
      );
    }
  }
}
