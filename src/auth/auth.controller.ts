import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dto';

// CONTROLLER UNTUK MENGELOLA ROUTER DAN VALIDATION
@Controller('auth')
export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @Get('users')
  users(@Res() res: Response) {
    return this.authService.users(res);
  }

  @Post('signup')
  signUp(@Body() dto: AuthDto, @Res() res: Response) {
    return this.authService.signUp(dto, res);
  }

  @Post('login')
  logIn(@Body() dto: AuthDto, @Res() res: Response) {
    return this.authService.logIn(dto, res);
  }
}
