import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('home')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('hunter')
  sayHi(): string {
    return this.authService.sayHi('bryan');
  }
}
