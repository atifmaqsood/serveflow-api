import { jest } from '@jest/globals';
import type { PrismaService } from '../database/prisma.service.js';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  const prisma = { $queryRaw: jest.fn() } as unknown as PrismaService;
  const controller = new HealthController(prisma);

  beforeEach(() => jest.clearAllMocks());

  it('returns a liveness response', () => {
    expect(controller.live().status).toBe('ok');
  });

  it('returns ready when PostgreSQL responds', async () => {
    jest.spyOn(prisma, '$queryRaw').mockResolvedValueOnce([{ '?column?': 1 }]);
    await expect(controller.ready()).resolves.toMatchObject({ status: 'ready', database: 'up' });
  });

  it('returns service unavailable when PostgreSQL fails', async () => {
    jest.spyOn(prisma, '$queryRaw').mockRejectedValueOnce(new Error('offline'));
    await expect(controller.ready()).rejects.toMatchObject({ status: 503 });
  });
});
