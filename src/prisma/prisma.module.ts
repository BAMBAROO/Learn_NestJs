import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // dapat diakses service atau controller lain tanpa perlu mengImport nya
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
