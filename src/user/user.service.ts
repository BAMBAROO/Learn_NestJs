import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  helloUser(value: string): string {
    return `haloo ${value}`;
  }
}
