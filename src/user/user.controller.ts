import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @Get('user')
  sayHi() {
    return this.userService.helloUser('haloo nama saya bryan');
  }
}
