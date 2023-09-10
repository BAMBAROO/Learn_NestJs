import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Response, Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

class InvalidCredentials extends HttpException {
  constructor() {
    super('Invalid Credentials', HttpStatus.UNAUTHORIZED);
  }
}

// SERVICE UNTUK MENGELOLA KE DATABASE
@Injectable()
export class AuthService {
  config: ConfigService;
  private jwt: JwtService;

  constructor(
    private prismaService: PrismaService,
    config: ConfigService,
    jwt: JwtService,
  ) {
    this.config = config;
    this.jwt = jwt;
  } // untuk mendapatkan akses terhadap PrismaService (prismaClient) yang juga terhadap akses ke databases

  async signUp(dto: AuthDto, res: Response) {
    try {
      const hash = await argon.hash(dto.password);
      // save to database
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash; // same just select option
      return res.status(HttpStatus.CREATED).json(user);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              error: 'Credentials taken',
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
      throw e;
    }
  }

  async signin(dto: AuthDto, res: Response) {
    try {
      const { email, password } = dto;
      const user = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
        select: {
          email: true,
          hash: true,
          id: true,
        },
      });
      if (!user) throw new InvalidCredentials();
      const matchPassword: boolean = await argon.verify(user.hash, password);
      if (!matchPassword) throw new InvalidCredentials();
      const accessToken: string = jwt.sign(
        user,
        this.config.get<string>('SECRET_KEY_ACCESS'),
        { expiresIn: '20s' },
      );
      // const refreshToken: string = jwt.sign(
      //   user,
      //   this.config.get<string>('SECRET_KEY_REFRESH'),
      //   { expiresIn: '1d' },
      // );
      const payload: object = { email: user.email, hash: user.hash };
      const refreshToken = await this.jwt.signAsync(payload, {
        secret: this.config.get<string>('SECRET_KEY_REFRESH'),
      });
      console.log({ refreshToken });
      res.cookie('refreshToken', refreshToken, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      await this.prismaService.user
        .update({
          where: {
            email: user.email,
          },
          data: {
            refreshToken: refreshToken,
          },
        })
        .catch((err): void => {
          console.log(err);
          res.sendStatus(HttpStatus.CONFLICT);
        });
      res.status(HttpStatus.OK).json(accessToken);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async users(res: Response) {
    try {
      const users = await this.prismaService.user.findMany();
      if (!users)
        throw new HttpException('Users Not Found', HttpStatus.NOT_FOUND);
      res.status(HttpStatus.OK).json({ users });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      await this.prismaService.user
        .findUnique({
          where: {
            refreshToken: refreshToken,
          },
          select: {
            email: true,
            id: true,
          },
        })
        .then(async (user: object) => {
          const accessToken: string = await this.jwt.signAsync(user, {
            secret: this.config.get<string>('SECRET_KEY_REFRESH'),
          });
          return res.status(HttpStatus.OK).json(accessToken);
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(HttpStatus.FORBIDDEN);
        });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
