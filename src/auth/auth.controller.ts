import { Controller, Get, Post, Body, Req, ParseIntPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthDto } from './dto';

// CONTROLLER UNTUK MENGELOLA ROUTER DAN VALIDATION
@Controller('auth')
export class AuthController {
  private authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Post('signin')
  signIn() {
    return this.authService.signIn();
  }

  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    console.log({ dto });
    return this.authService.signUp(dto);
  }

  @Post('login')
  logIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
  ) {
    console.log(req.body);
    console.log({
      email: email,
      typeOfEmail: typeof email,
      password: password,
      typeOfPassword: typeof password,
    });
    return this.authService.logIn();
  }
}
