import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../database/prisma.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('live')
  @ApiOperation({ summary: 'Process liveness check' })
  @ApiResponse({ status: 200, description: 'The API process is running.' })
  live(): { status: 'ok'; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Dependency readiness check' })
  @ApiResponse({ status: 200, description: 'The API can reach its required dependencies.' })
  @ApiResponse({ status: 503, description: 'A required dependency is unavailable.' })
  async ready(): Promise<{ status: 'ready'; database: 'up'; timestamp: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready', database: 'up', timestamp: new Date().toISOString() };
    } catch {
      throw new ServiceUnavailableException({
        code: 'DATABASE_UNAVAILABLE',
        message: 'The database is unavailable',
      });
    }
  }
}
