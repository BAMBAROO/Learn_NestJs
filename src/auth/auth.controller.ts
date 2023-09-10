import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  // ParseIntPipe,
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

  @Post('users')
  users(@Res() res: Response) {
    return this.authService.users(res);
  }

  @Post('signup')
  signUp(@Body() dto: AuthDto, @Res() res: Response) {
    return this.authService.signUp(dto, res);
  }

  @Post('signin')
  logIn(@Body() dto: AuthDto, @Res() res: Response, @Req() req: Request) {
    return this.authService.signin(dto, res);
  }

  @Get('token')
  refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
  }
}
