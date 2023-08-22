import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  // imports: [PrismaModule], // this still works because in prisma module we use @Gblobal()
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
