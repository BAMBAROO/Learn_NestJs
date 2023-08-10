import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private myName = 'bryan';

  sayHi(value: string): string {
    return `haloo nama saya adalah ${value}`;
  }
  giveNumber(value: number): number {
    return value * 2;
  }
}
