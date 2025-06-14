import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtUtil } from 'src/common/utils/jwt/jwt.utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtUtil: JwtUtil) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const appKey = request.headers['x-app-key'];
    const clientId = request.headers['x-client-id'];

    if (!token || !appKey || !clientId) {
      throw new UnauthorizedException('Missing required headers');
    }

    try {
      const decoded = this.jwtUtil.verifyToken(token);

      // Validate claims
      if (decoded.clientId !== clientId) {
        throw new UnauthorizedException('Invalid client ID');
      }

      // Store decoded token in request for later use
      request.user = decoded;
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new UnauthorizedException('Invalid token', error.message);
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
