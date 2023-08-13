import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  private userService: UserService;
  constructor(userService: UserService) {
    this.userService = userService;
  }
  @Get('user')
  sayHi() {
    return this.userService.helloUser('haloo nama saya bryan');
  }
}
