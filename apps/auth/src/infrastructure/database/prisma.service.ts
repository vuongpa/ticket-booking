import { Injectable } from '@nestjs/common';

// This is a placeholder service that doesn't do anything
// We've migrated away from using Prisma for the auth service
// but some code might still reference this service during transition

@Injectable()
export class PrismaService {
  async $connect() {
    // No-op
    console.log(
      'PrismaService is disabled - now using userServiceClient instead',
    );
    return Promise.resolve();
  }

  async $disconnect() {
    // No-op
    return Promise.resolve();
  }
}
