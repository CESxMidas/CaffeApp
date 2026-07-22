import { Test } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { PrismaService } from '../../src/common/prisma/prisma.service';

/**
 * REAL PostgreSQL integration test.
 *
 * Unlike `src/app.characterization.spec.ts` (which overrides PrismaService with
 * an in-memory fake), this suite talks to a real PostgreSQL instance through the
 * real Prisma Client. It proves things the in-memory fake cannot: that
 * migrations are compatible, that NestJS DI wires the real PrismaService, and
 * that real database constraints and transactions are enforced.
 *
 * Requires `TEST_DATABASE_URL` (guarded by test/integration/setup-env.ts) and a
 * database with migrations applied (`prisma migrate deploy`).
 */

// Deterministic, namespaced test data so cleanup is precise and never touches
// seed/dev rows.
const TEST_BRANCH_ID = 'aaaaaaaa-0000-4000-8000-0000000000ff';
const ROLLBACK_BRANCH_ID = 'aaaaaaaa-0000-4000-8000-0000000000fe';
const TEST_EMAIL = 'p1c-integration@test.local';

async function cleanup(prisma: PrismaService): Promise<void> {
  // Order respects foreign keys; Branch delete cascades its children.
  await prisma.user.deleteMany({ where: { email: TEST_EMAIL } });
  await prisma.branch.deleteMany({
    where: { id: { in: [TEST_BRANCH_ID, ROLLBACK_BRANCH_ID] } },
  });
}

describe('PostgreSQL integration (real Prisma + real database)', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
    await cleanup(prisma);
  });

  afterAll(async () => {
    if (prisma) {
      await cleanup(prisma);
      await prisma.$disconnect();
    }
  });

  it('connects to a real database with migrations applied', async () => {
    const rows = await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1 as ok`;
    expect(Number(rows[0].ok)).toBe(1);

    // `branches` table only exists if migrations were applied.
    await expect(prisma.branch.count()).resolves.toBeGreaterThanOrEqual(0);
  });

  it('persists and reads back an entity, applying DB-side defaults', async () => {
    const created = await prisma.branch.create({
      data: { id: TEST_BRANCH_ID, name: 'P1C Integration Branch' },
    });
    expect(created.id).toBe(TEST_BRANCH_ID);

    const read = await prisma.branch.findUnique({ where: { id: TEST_BRANCH_ID } });
    expect(read?.name).toBe('P1C Integration Branch');
    // `isActive` default and timestamps come from the database schema.
    expect(read?.isActive).toBe(true);
    expect(read?.createdAt).toBeInstanceOf(Date);
  });

  it('enforces a real unique constraint (User.email)', async () => {
    await prisma.user.create({
      data: { email: TEST_EMAIL, fullName: 'Integration A', passwordHash: 'not-a-real-hash' },
    });

    // The in-memory fake would happily allow this; a real DB rejects it (P2002).
    await expect(
      prisma.user.create({
        data: { email: TEST_EMAIL, fullName: 'Integration B', passwordHash: 'not-a-real-hash' },
      }),
    ).rejects.toMatchObject({ code: 'P2002' });
  });

  it('rolls back a real transaction when it throws (atomicity)', async () => {
    await expect(
      prisma.$transaction(async (tx) => {
        await tx.branch.create({ data: { id: ROLLBACK_BRANCH_ID, name: 'Rollback Branch' } });
        throw new Error('force rollback');
      }),
    ).rejects.toThrow('force rollback');

    const persisted = await prisma.branch.findUnique({ where: { id: ROLLBACK_BRANCH_ID } });
    expect(persisted).toBeNull();
  });
});
