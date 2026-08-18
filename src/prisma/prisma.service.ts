import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log('Successfully connected to Database');
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`Database connection warning: ${err.message || err}. Operating in fallback mode for Swagger demo.`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect().catch(() => {});
  }
}

