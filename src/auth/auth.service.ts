import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

// SERVICE UNTUK MENGELOLA KE DATABASE
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {} // untuk mendapatkan akses terhadap PrismaService (prismaClient) yang juga terhadap akses ke databases
  async signUp(dto: AuthDto) {
    // hashing password
    const hash = await argon.hash(dto.password);
    // save user to db
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });
    return user;
  }

  logIn() {
    return { message: 'hallo' };
  }

  signIn() {
    return { message: 'i have sign In' };
  }
}
