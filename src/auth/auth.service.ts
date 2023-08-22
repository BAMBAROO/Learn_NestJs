import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

class InvalidCredentials extends HttpException {
  constructor() {
    super('Invalid Credentials', HttpStatus.UNAUTHORIZED);
  }
}

// SERVICE UNTUK MENGELOLA KE DATABASE
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {} // untuk mendapatkan akses terhadap PrismaService (prismaClient) yang juga terhadap akses ke databases
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

  async logIn(dto: AuthDto, res: Response) {
    try {
      const { email, password } = dto;
      const user = await this.prismaService.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) throw new InvalidCredentials();
      const matchPassword: boolean = await argon.verify(user.hash, password);
      if (!matchPassword) throw new InvalidCredentials();
      res.sendStatus(HttpStatus.OK);
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
}
