import { Injectable } from '@nestjs/common';

interface User {
  name: string;
  age: number;
  job: string;
}
@Injectable()
export class AuthService {
  private myName = 'bryan';

  sayHi(value: string): string {
    return `haloo nama saya adalah ${value}`;
  }
}
