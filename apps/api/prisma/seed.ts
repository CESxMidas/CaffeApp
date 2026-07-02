import * as bcrypt from 'bcrypt';
import {
  BranchAssignmentStatus,
  NotificationType,
  PrismaClient,
  StaffRole,
  TableStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

const BRANCH_Q1 = 'a0000000-0000-0000-0000-000000000001';
const BRANCH_Q3 = 'a0000000-0000-0000-0000-000000000002';
const DEMO_PASSWORD = 'password123';

// VietQR bank info for testing
const BANK_INFO = {
  bank: 'MSB',
  bankCode: 'MSB',
  account: '88898017684358',
  holder: 'Do Huy Hoang',
};

interface DemoUser {
  id: string;
  email: string;
  fullName: string;
  role: StaffRole;
  staffId: string;
  branchId: string | null;
  branchAssignmentStatus: BranchAssignmentStatus;
  phone?: string;
}

const USERS: DemoUser[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    email: 'cashier@caffe.app',
    fullName: 'Nguyễn Văn Minh',
    role: StaffRole.CASHIER,
    staffId: 'c0000000-0000-0000-0000-000000000001',
    branchId: BRANCH_Q1,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    phone: '0901111001',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000005',
    email: 'cashier2@caffe.app',
    fullName: 'Hoàng Thị Mai',
    role: StaffRole.CASHIER,
    staffId: 'c0000000-0000-0000-0000-000000000005',
    branchId: BRANCH_Q1,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    phone: '0901111005',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    email: 'barista@caffe.app',
    fullName: 'Trần Thị Lan',
    role: StaffRole.BARISTA,
    staffId: 'c0000000-0000-0000-0000-000000000002',
    branchId: BRANCH_Q1,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    phone: '0902222001',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000006',
    email: 'barista2@caffe.app',
    fullName: 'Lê Văn Tú',
    role: StaffRole.BARISTA,
    staffId: 'c0000000-0000-0000-0000-000000000006',
    branchId: BRANCH_Q1,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    phone: '0902222002',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    email: 'manager@caffe.app',
    fullName: 'Phạm Văn Nam',
    role: StaffRole.MANAGER,
    staffId: 'c0000000-0000-0000-0000-000000000003',
    branchId: BRANCH_Q1,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    phone: '0903333001',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000007',
    email: 'cashier.q3@caffe.app',
    fullName: 'Võ Thị Hương',
    role: StaffRole.CASHIER,
    staffId: 'c0000000-0000-0000-0000-000000000007',
    branchId: BRANCH_Q3,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    phone: '0904444001',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000008',
    email: 'barista.q3@caffe.app',
    fullName: 'Đặng Văn Khoa',
    role: StaffRole.BARISTA,
    staffId: 'c0000000-0000-0000-0000-000000000008',
    branchId: BRANCH_Q3,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    phone: '0904444002',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000009',
    email: 'manager.q3@caffe.app',
    fullName: 'Bùi Thị Ngọc',
    role: StaffRole.MANAGER,
    staffId: 'c0000000-0000-0000-0000-000000000009',
    branchId: BRANCH_Q3,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
    phone: '0904444003',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    email: 'owner@caffe.app',
    fullName: 'Lê Thị Hoa',
    role: StaffRole.OWNER,
    staffId: 'c0000000-0000-0000-0000-000000000004',
    branchId: null,
    branchAssignmentStatus: BranchAssignmentStatus.NONE,
    phone: '0909999001',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000010',
    email: 'station@caffe.app',
    fullName: 'Trạm thu ngân Q1',
    role: StaffRole.CASHIER,
    staffId: 'c0000000-0000-0000-0000-000000000010',
    branchId: BRANCH_Q1,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000011',
    email: 'station.q3@caffe.app',
    fullName: 'Trạm thu ngân Q3',
    role: StaffRole.CASHIER,
    staffId: 'c0000000-0000-0000-0000-000000000011',
    branchId: BRANCH_Q3,
    branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
  },
];

const MENU_CATEGORIES = [
  { slug: 'ca-phe', name: 'Cà phê', sortOrder: 1 },
  { slug: 'tra', name: 'Trà', sortOrder: 2 },
  { slug: 'banh', name: 'Bánh', sortOrder: 3 },
  { slug: 'nuoc-ep', name: 'Nước ép', sortOrder: 4 },
] as const;

const MENU_PRODUCTS = [
  { cat: 'ca-phe', name: 'Cà phê sữa đá', price: 35000 },
  { cat: 'ca-phe', name: 'Bạc xỉu', price: 38000 },
  { cat: 'ca-phe', name: 'Cà phê đen', price: 29000 },
  { cat: 'ca-phe', name: 'Latte', price: 45000 },
  { cat: 'ca-phe', name: 'Cappuccino', price: 48000 },
  { cat: 'tra', name: 'Trà đào cam sả', price: 42000 },
  { cat: 'tra', name: 'Trà vải', price: 40000 },
  { cat: 'tra', name: 'Trà sữa trân châu', price: 45000 },
  { cat: 'banh', name: 'Bánh croissant', price: 32000 },
  { cat: 'banh', name: 'Tiramisu', price: 55000 },
  { cat: 'banh', name: 'Bánh mì thịt nguội', price: 38000 },
  { cat: 'nuoc-ep', name: 'Cam vắt', price: 35000 },
  { cat: 'nuoc-ep', name: 'Dưa hấu', price: 30000 },
  { cat: 'nuoc-ep', name: 'Chanh dây', price: 32000 },
] as const;

/** Bàn bảo trì demo — khớp design 06-so-do-ban */
const MAINTENANCE_CODES_Q1 = new Set(['B12']);

async function seedBranchTables(branchId: string, maintenance: Set<string>) {
  for (let i = 1; i <= 50; i++) {
    const code = `B${String(i).padStart(2, '0')}`;
    const floor = i <= 25 ? 'Tầng 1' : 'Tầng 2';
    const status: TableStatus = maintenance.has(code) ? TableStatus.MAINTENANCE : TableStatus.EMPTY;

    await prisma.table.upsert({
      where: { branchId_code: { branchId, code } },
      update: { floor, status, capacity: i % 3 === 0 ? 6 : 4 },
      create: { branchId, code, floor, capacity: i % 3 === 0 ? 6 : 4, status },
    });
  }
}

async function seedBranchMenu(branchId: string) {
  const categoryIds = new Map<string, string>();

  for (const cat of MENU_CATEGORIES) {
    const row = await prisma.productCategory.upsert({
      where: { branchId_slug: { branchId, slug: cat.slug } },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: { branchId, name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder },
    });
    categoryIds.set(cat.slug, row.id);
  }

  for (const product of MENU_PRODUCTS) {
    const categoryId = categoryIds.get(product.cat)!;
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

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.branch.upsert({
    where: { id: BRANCH_Q1 },
    update: {
      name: 'CN Quận 1',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
      phone: '0281234567',
      bankInfo: BANK_INFO,
    },
    create: {
      id: BRANCH_Q1,
      name: 'CN Quận 1',
      address: '123 Nguyễn Huệ, Q.1, TP.HCM',
      phone: '0281234567',
      bankInfo: BANK_INFO,
    },
  });

  await prisma.branch.upsert({
    where: { id: BRANCH_Q3 },
    update: {
      name: 'CN Quận 3',
      address: '45 Võ Văn Tần, Q.3, TP.HCM',
      phone: '0287654321',
      bankInfo: BANK_INFO,
    },
    create: {
      id: BRANCH_Q3,
      name: 'CN Quận 3',
      address: '45 Võ Văn Tần, Q.3, TP.HCM',
      phone: '0287654321',
      bankInfo: BANK_INFO,
    },
  });

  for (const demo of USERS) {
    await prisma.user.upsert({
      where: { id: demo.id },
      update: { passwordHash, fullName: demo.fullName, isActive: true },
      create: {
        id: demo.id,
        email: demo.email,
        passwordHash,
        fullName: demo.fullName,
        isActive: true,
      },
    });

    await prisma.staff.upsert({
      where: { id: demo.staffId },
      update: {
        role: demo.role,
        fullName: demo.fullName,
        branchId: demo.branchId,
        phone: demo.phone ?? null,
        branchAssignmentStatus: demo.branchAssignmentStatus,
        isActive: true,
      },
      create: {
        id: demo.staffId,
        userId: demo.id,
        branchId: demo.branchId,
        role: demo.role,
        fullName: demo.fullName,
        phone: demo.phone ?? null,
        branchAssignmentStatus: demo.branchAssignmentStatus,
        isActive: true,
        ...(demo.branchAssignmentStatus === BranchAssignmentStatus.APPROVED
          ? { approvedAt: new Date() }
          : {}),
      },
    });

    console.log(`Seeded user: ${demo.email} (${demo.role})`);
  }

  await seedBranchTables(BRANCH_Q1, MAINTENANCE_CODES_Q1);
  await seedBranchTables(BRANCH_Q3, new Set(['B50']));
  console.log('Seeded 50 tables × 2 branches (2 floors each)');

  await seedBranchMenu(BRANCH_Q1);
  await seedBranchMenu(BRANCH_Q3);
  console.log('Seeded menu categories & products');

  const cashierStaffId = 'c0000000-0000-0000-0000-000000000001';
  await prisma.notification.deleteMany({ where: { staffId: cashierStaffId } });
  await prisma.notification.createMany({
    data: [
      {
        branchId: BRANCH_Q1,
        staffId: cashierStaffId,
        type: NotificationType.ORDER_READY,
        title: 'Món đã xong',
        body: 'Đơn #20260628-003 sẵn sàng giao khách',
        metadata: { orderNumber: '20260628-003' },
      },
      {
        branchId: BRANCH_Q1,
        staffId: cashierStaffId,
        type: NotificationType.ORDER_READY,
        title: 'Món đã xong',
        body: 'Đơn #20260628-007 sẵn sàng giao khách',
        metadata: { orderNumber: '20260628-007' },
      },
      {
        branchId: BRANCH_Q1,
        staffId: cashierStaffId,
        type: NotificationType.SYSTEM,
        title: 'Ca sáng',
        body: 'Ca sáng 07:00–14:00 — nhớ kiểm tra sơ đồ bàn trước giờ cao điểm',
        readAt: new Date(),
      },
    ],
  });
  console.log('Seeded sample notifications for cashier');

  console.log(`Demo password for all users: ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
