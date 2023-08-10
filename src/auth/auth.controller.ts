import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('hunter')
  sayHi(): string {
    return this.authService.sayHi('bryan');
  }

  @Post('home')
  getNumber(@Body() data): number {
    const { angka } = data;
    console.log(angka);
    return this.authService.giveNumber(angka);
  }
}
