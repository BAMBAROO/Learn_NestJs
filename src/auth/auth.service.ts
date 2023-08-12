import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  signUp() {
    return { message: 'i have sign up' };
  }

  signIn() {
    return { message: 'i have sign In' };
  }
}
