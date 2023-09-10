import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, request, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyToken implements NestMiddleware {
  config: ConfigService;
  private jwt: JwtService;

  constructor(config: ConfigService, jwt: JwtService) {
    this.config = config;
    this.jwt = jwt;
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const header: string = req.headers['authorization'];
      const token: string = header && header.split(' ')[1];
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get('SECRET_KEY_ACCESS'),
      });
      req['users'] = payload;
      next();
    } catch (err) {
      console.log(err);
      return res.sendStatus(HttpStatus.UNAUTHORIZED);
    }
  }
}
