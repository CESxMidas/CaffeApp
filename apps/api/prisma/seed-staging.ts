/**
 * Staging / UAT seed — menu thật (D-13), 3 CN, 50 bàn/CN, staff pilot.
 * Dev local demo: npm run db:seed (seed.ts).
 */
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import {
  BranchAssignmentStatus,
  Prisma,
  PrismaClient,
  StaffRole,
  TableStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

const DATA_DIR = path.join(__dirname, 'data');

interface StagingBranchRow {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  bankInfo: Prisma.InputJsonValue;
}

interface StagingMenuFile {
  categories: { slug: string; name: string; sortOrder: number }[];
  products: { cat: string; name: string; price: number }[];
}

interface StagingBranchesFile {
  branches: StagingBranchRow[];
}

const OWNER = {
  userId: 'b0000000-0000-0000-0000-000000000100',
  staffId: 'c0000000-0000-0000-0000-000000000100',
  email: 'owner@caffe.app',
  fullName: 'Lê Thị Hoa',
  phone: '0909999001',
};

/** T1×20, T2×20, Sân×10 — A-03 */
const TABLE_ZONES = [
  { floor: 'Tầng 1', prefix: 'B', count: 20, start: 1 },
  { floor: 'Tầng 2', prefix: 'B', count: 20, start: 21 },
  { floor: 'Sân', prefix: 'S', count: 10, start: 1 },
] as const;

function expectedTableCodes(): string[] {
  const codes: string[] = [];
  for (const zone of TABLE_ZONES) {
    for (let i = 0; i < zone.count; i++) {
      const n = zone.start + i;
      codes.push(`${zone.prefix}${String(n).padStart(2, '0')}`);
    }
  }
  return codes;
}

function loadJson<T>(filename: string): T {
  const raw = fs.readFileSync(path.join(DATA_DIR, filename), 'utf8');
  return JSON.parse(raw) as T;
}

function staffIdsForBranch(branchIndex: number) {
  const base = branchIndex * 10;
  return {
    manager: {
      userId: `b0000000-0000-0000-0000-00000000${String(base + 1).padStart(4, '0')}`,
      staffId: `c0000000-0000-0000-0000-00000000${String(base + 1).padStart(4, '0')}`,
    },
    cashier: {
      userId: `b0000000-0000-0000-0000-00000000${String(base + 2).padStart(4, '0')}`,
      staffId: `c0000000-0000-0000-0000-00000000${String(base + 2).padStart(4, '0')}`,
    },
    barista: {
      userId: `b0000000-0000-0000-0000-00000000${String(base + 3).padStart(4, '0')}`,
      staffId: `c0000000-0000-0000-0000-00000000${String(base + 3).padStart(4, '0')}`,
    },
    station: {
      userId: `b0000000-0000-0000-0000-00000000${String(base + 4).padStart(4, '0')}`,
      staffId: `c0000000-0000-0000-0000-00000000${String(base + 4).padStart(4, '0')}`,
    },
  };
}

const BRANCH_STAFF_NAMES: Record<
  string,
  { manager: string; cashier: string; barista: string; station: string }
> = {
  q1: {
    manager: 'Phạm Văn Nam',
    cashier: 'Nguyễn Văn Minh',
    barista: 'Trần Thị Lan',
    station: 'Trạm thu ngân Q1',
  },
  q3: {
    manager: 'Bùi Thị Ngọc',
    cashier: 'Võ Thị Hương',
    barista: 'Đặng Văn Khoa',
    station: 'Trạm thu ngân Q3',
  },
  q7: {
    manager: 'Ngô Minh Tuấn',
    cashier: 'Lý Thị Hồng',
    barista: 'Phan Văn Đức',
    station: 'Trạm thu ngân Q7',
  },
};

async function upsertUserStaff(
  passwordHash: string,
  preferredUserId: string,
  preferredStaffId: string,
  email: string,
  fullName: string,
  role: StaffRole,
  branchId: string | null,
  phone?: string,
) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  const userId = existingUser?.id ?? preferredUserId;

  await prisma.user.upsert({
    where: { id: userId },
    update: { passwordHash, fullName, isActive: true, email },
    create: { id: userId, email, passwordHash, fullName, isActive: true },
  });

  const existingStaff = await prisma.staff.findFirst({ where: { userId } });
  const staffId = existingStaff?.id ?? preferredStaffId;

  const assignmentStatus =
    branchId === null ? BranchAssignmentStatus.NONE : BranchAssignmentStatus.APPROVED;

  await prisma.staff.upsert({
    where: { id: staffId },
    update: {
      role,
      fullName,
      branchId,
      phone: phone ?? null,
      branchAssignmentStatus: assignmentStatus,
      isActive: true,
      userId,
    },
    create: {
      id: staffId,
      userId,
      branchId,
      role,
      fullName,
      phone: phone ?? null,
      branchAssignmentStatus: assignmentStatus,
      isActive: true,
      ...(assignmentStatus === BranchAssignmentStatus.APPROVED ? { approvedAt: new Date() } : {}),
    },
  });
}

async function seedBranchTables(branchId: string) {
  const codes = expectedTableCodes();
  for (const zone of TABLE_ZONES) {
    for (let i = 0; i < zone.count; i++) {
      const n = zone.start + i;
      const code = `${zone.prefix}${String(n).padStart(2, '0')}`;
      await prisma.table.upsert({
        where: { branchId_code: { branchId, code } },
        update: {
          floor: zone.floor,
          status: TableStatus.EMPTY,
          capacity: zone.prefix === 'S' ? 6 : 4,
        },
        create: {
          branchId,
          code,
          floor: zone.floor,
          capacity: zone.prefix === 'S' ? 6 : 4,
          status: TableStatus.EMPTY,
        },
      });
    }
  }
  const pruned = await prisma.table.deleteMany({
    where: { branchId, code: { notIn: codes } },
  });
  if (pruned.count > 0) {
    console.log(`  Pruned ${pruned.count} legacy table code(s)`);
  }
}

async function pruneBranchMenu(branchId: string, menu: StagingMenuFile) {
  const stagingSlugs = new Set(menu.categories.map((c) => c.slug));
  const stagingKeys = new Set(menu.products.map((p) => `${p.cat}|${p.name}`));

  const products = await prisma.product.findMany({
    where: { branchId },
    include: { category: { select: { slug: true } } },
  });

  let deactivated = 0;
  for (const product of products) {
    const key = `${product.category.slug}|${product.name}`;
    if (!stagingKeys.has(key)) {
      await prisma.product.update({
        where: { id: product.id },
        data: { isAvailable: false },
      });
      deactivated++;
    }
  }

  await prisma.productCategory.updateMany({
    where: { branchId, slug: { notIn: [...stagingSlugs] } },
    data: { isActive: false },
  });

  if (deactivated > 0) {
    console.log(`  Deactivated ${deactivated} legacy menu item(s)`);
  }
}

async function seedBranchMenu(branchId: string, menu: StagingMenuFile) {
  const categoryIds = new Map<string, string>();

  for (const cat of menu.categories) {
    const row = await prisma.productCategory.upsert({
      where: { branchId_slug: { branchId, slug: cat.slug } },
      update: { name: cat.name, sortOrder: cat.sortOrder, isActive: true },
      create: {
        branchId,
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryIds.set(cat.slug, row.id);
  }

  for (const product of menu.products) {
    const categoryId = categoryIds.get(product.cat);
    if (!categoryId) {
      throw new Error(`Unknown category slug: ${product.cat}`);
    }
    const existing = await prisma.product.findFirst({
      where: { branchId, categoryId, name: product.name },
    });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: { price: product.price, isAvailable: true },
      });
    } else {
      await prisma.product.create({
        data: {
          branchId,
          categoryId,
          name: product.name,
          price: product.price,
          isAvailable: true,
        },
      });
    }
  }
}

async function verifyCounts(branchIds: string[]) {
  const branchCount = await prisma.branch.count({ where: { isActive: true } });
  const tableCount = await prisma.table.count({ where: { branchId: { in: branchIds } } });
  const categoryCount = await prisma.productCategory.count({
    where: { branchId: { in: branchIds } },
  });
  const productCount = await prisma.product.count({
    where: { branchId: { in: branchIds }, isAvailable: true },
  });
  const staffCount = await prisma.staff.count({
    where: { branchId: { in: branchIds }, isActive: true },
  });

  console.log('\n--- Staging seed verification ---');
  console.log(`Branches (active): ${branchCount} (expected ≥ 3)`);
  console.log(`Tables (3 CN):     ${tableCount} (expected ${branchIds.length * 50})`);
  console.log(`Categories:        ${categoryCount} (expected ${branchIds.length * 8})`);
  console.log(`Products:          ${productCount} (expected ${branchIds.length * 38})`);
  console.log(`Branch staff:      ${staffCount} (expected ${branchIds.length * 4})`);

  const perBranch = await Promise.all(
    branchIds.map(async (id) => {
      const name = (await prisma.branch.findUnique({ where: { id }, select: { name: true } }))
        ?.name;
      const tables = await prisma.table.count({ where: { branchId: id } });
      const products = await prisma.product.count({
        where: { branchId: id, isAvailable: true },
      });
      return { name, tables, products };
    }),
  );
  for (const row of perBranch) {
    console.log(`  · ${row.name}: ${row.tables} bàn, ${row.products} món`);
  }
}

async function main() {
  const password = process.env.STAGING_SEED_PASSWORD ?? 'password123';
  const passwordHash = await bcrypt.hash(password, 10);

  const { branches } = loadJson<StagingBranchesFile>('staging-branches.json');
  const menu = loadJson<StagingMenuFile>('staging-menu.json');

  console.log(`Staging seed — ${branches.length} chi nhánh, ${menu.products.length} món/CN`);
  if (process.env.DATABASE_URL?.includes('localhost')) {
    console.warn('⚠ DATABASE_URL trỏ localhost — chỉ dùng để test seed cục bộ.');
  }

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      update: {
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        bankInfo: branch.bankInfo,
        isActive: true,
      },
      create: {
        id: branch.id,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        bankInfo: branch.bankInfo,
        isActive: true,
      },
    });
    console.log(`Branch: ${branch.name}`);
  }

  await upsertUserStaff(
    passwordHash,
    OWNER.userId,
    OWNER.staffId,
    OWNER.email,
    OWNER.fullName,
    StaffRole.OWNER,
    null,
    OWNER.phone,
  );
  console.log(`Owner: ${OWNER.email}`);

  for (let i = 0; i < branches.length; i++) {
    const branch = branches[i];
    const ids = staffIdsForBranch(i + 1);
    const names = BRANCH_STAFF_NAMES[branch.slug];

    const accounts = [
      {
        ...ids.manager,
        email: `manager.${branch.slug}@caffe.app`,
        fullName: names.manager,
        role: StaffRole.MANAGER,
        phone: `0903${String(i + 1).padStart(2, '0')}0001`,
      },
      {
        ...ids.cashier,
        email: `cashier.${branch.slug}@caffe.app`,
        fullName: names.cashier,
        role: StaffRole.CASHIER,
        phone: `0901${String(i + 1).padStart(2, '0')}0001`,
      },
      {
        ...ids.barista,
        email: `barista.${branch.slug}@caffe.app`,
        fullName: names.barista,
        role: StaffRole.BARISTA,
        phone: `0902${String(i + 1).padStart(2, '0')}0001`,
      },
      {
        ...ids.station,
        email: `station.${branch.slug}@caffe.app`,
        fullName: names.station,
        role: StaffRole.CASHIER,
      },
    ] as const;

    for (const acc of accounts) {
      await upsertUserStaff(
        passwordHash,
        acc.userId,
        acc.staffId,
        acc.email,
        acc.fullName,
        acc.role,
        branch.id,
        'phone' in acc ? acc.phone : undefined,
      );
      console.log(`  ${acc.email} (${acc.role})`);
    }

    await seedBranchTables(branch.id);
    await seedBranchMenu(branch.id, menu);
    await pruneBranchMenu(branch.id, menu);
    console.log(
      `  → 50 bàn + menu (${menu.categories.length} category, ${menu.products.length} món)`,
    );
  }

  await verifyCounts(branches.map((b) => b.id));

  console.log(`\nMật khẩu staging: ${password}`);
  console.log(
    'Verify API (sau login): GET /api/v1/branches, /products?branchId=…, /tables?branchId=…',
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
