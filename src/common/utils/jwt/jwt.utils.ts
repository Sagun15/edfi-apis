import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TokenClaims {
  clientName: string;
  clientId: string;
  scopes: string[];
}

@Injectable()
export class JwtUtil {
  private privateKey: string;
  private publicKey: string;

  constructor(private configService: ConfigService) {
    // Load certificates from filesystem or environment variables
    this.publicKey = fs.readFileSync(
      this.configService.get<string>('PUBLIC_KEY_PATH'),
      'utf8',
    );
  }

  verifyToken(
    token: string,
  ): TokenClaims & { iat: number; exp: number; iss: string } {
    try {
      const decoded = jwt.verify(token, this.publicKey, {
        algorithms: ['RS256'],
      });
      return decoded as TokenClaims & { iat: number; exp: number; iss: string };
    } catch (error) {
      throw new Error(`Token verification failed: ${error}`);
    }
  }
}
