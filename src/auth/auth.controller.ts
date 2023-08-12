import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  sayHi(): object {
    return this.authService.signIn();
  }

  @Post('signup')
  getNumber(): object {
    return this.authService.signUp();
  }
}
