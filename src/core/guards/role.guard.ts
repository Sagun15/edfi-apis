import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
// import { UsersService } from '../../modules/users/services/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    // UsersService has been included here for user role validation. TO be implemented
    // @Inject(forwardRef(() => UsersService))
    // private userService: UsersService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<string[]>('role', context.getHandler());

    if (!role) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request, role);
  }

  async validateRequest(_request, _role) {
    // TODO- console.log statements to comply with eslint, remove after implementation.
    console.log(_request);
    console.log(_role);

    //TODO: Implement this function once the auth has been defined.

    // const user = await this.userService.getUserByUserName(_request.user.sub);

    return true;
  }
}
