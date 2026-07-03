import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';
import {
  BranchAssignmentStatus,
  NotificationType,
  OrderStatus,
  OrderType,
  PaymentMethod,
  ShiftStatus,
  StaffRole,
  TableStatus,
} from '@prisma/client';
import { AppModule } from './app.module';
import { PrismaService } from './common/prisma/prisma.service';
import { EmailService } from './common/email/email.service';
import type { BranchBankInfoDto } from '@caffeapp/shared';

const ids = {
  branch: '11111111-1111-1111-1111-111111111111',
  table: '22222222-2222-2222-2222-222222222222',
  table2: '22222222-2222-2222-2222-222222222223',
  table3: '22222222-2222-2222-2222-222222222224',
  product: '33333333-3333-3333-3333-333333333333',
  cashierUser: '44444444-4444-4444-4444-444444444444',
  cashierStaff: '55555555-5555-5555-5555-555555555555',
  baristaUser: '66666666-6666-6666-6666-666666666666',
  baristaStaff: '77777777-7777-7777-7777-777777777777',
  managerUser: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  managerStaff: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  shift: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
};

type OrderRecord = {
  id: string;
  branchId: string;
  shiftId: string | null;
  tableId: string | null;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  total: number;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date | null;
  paidAt: Date | null;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    notes: string | null;
    isPrepared: boolean;
    preparedAt: Date | null;
  }>;
};

type UserRow = {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  isActive: boolean;
};

type StaffRow = {
  id: string;
  userId: string;
  branchId: string;
  role: StaffRole;
  fullName: string;
  phone: string | null;
  isActive: boolean;
  branchAssignmentStatus: BranchAssignmentStatus;
};

type BranchRow = {
  id: string;
  name: string;
  address: string;
  phone: string;
  bankInfo: BranchBankInfoDto;
  isActive: boolean;
};

type ProductRow = {
  id: string;
  branchId: string;
  name: string;
  price: number;
  isAvailable: boolean;
};

type TableRow = {
  id: string;
  branchId: string;
  code: string;
  name: string;
  status: TableStatus;
};

type PaymentRow = {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  changeAmount: number | null;
  reference: string | null;
  paidAt: Date;
};

type ShiftRow = {
  id: string;
  branchId: string;
  name: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  openedAt: Date | null;
  closedAt: Date | null;
  status: ShiftStatus;
  totalRevenue: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
};

type NotificationRow = {
  id: string;
  branchId: string;
  staffId: string;
  type: NotificationType;
  title: string;
  body: string;
  readAt: Date | null;
  metadata: unknown;
  createdAt: Date;
};

type PasswordChangeOtpRow = {
  id: string;
  userId: string;
  codeHash: string;
  newPasswordHash: string;
  attempts: number;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
};

type StaffWhere = {
  id?: string;
  branchId?: string | null;
  isActive?: boolean;
  branchAssignmentStatus?: BranchAssignmentStatus;
  role?: StaffRole | { in?: StaffRole[]; not?: StaffRole };
};

type OrderItemCreateData = Omit<OrderRecord['items'][number], 'id' | 'isPrepared' | 'preparedAt'> &
  Partial<Pick<OrderRecord['items'][number], 'isPrepared' | 'preparedAt'>>;

class InMemoryPrisma {
  private users: UserRow[] = [];
  private staffRows: StaffRow[] = [];
  private branches: BranchRow[] = [];
  private products: ProductRow[] = [];
  private tables: TableRow[] = [];
  private orders: OrderRecord[] = [];
  private payments: PaymentRow[] = [];
  private shifts: ShiftRow[] = [];
  private notifications: NotificationRow[] = [];
  private passwordChangeOtps: PasswordChangeOtpRow[] = [];
  private orderSeq = 1;
  private itemSeq = 1;
  private paymentSeq = 1;
  private notificationSeq = 1;
  private passwordChangeOtpSeq = 1;

  async seed() {
    const passwordHash = await bcrypt.hash('password123', 4);
    this.branches = [
      {
        id: ids.branch,
        name: 'Caffe Pilot',
        address: '1 Test Street',
        phone: '0900000000',
        bankInfo: {
          bank: 'Vietcombank',
          bankCode: 'VCB',
          account: '1023456789',
          holder: 'CTY TNHH CA PHE PILOT',
        },
        isActive: true,
      },
    ];
    this.users = [
      {
        id: ids.cashierUser,
        email: 'cashier@caffe.app',
        passwordHash,
        fullName: 'Cashier One',
        isActive: true,
      },
      {
        id: ids.baristaUser,
        email: 'barista@caffe.app',
        passwordHash,
        fullName: 'Barista One',
        isActive: true,
      },
      {
        id: ids.managerUser,
        email: 'manager@caffe.app',
        passwordHash,
        fullName: 'Manager One',
        isActive: true,
      },
    ];
    this.staffRows = [
      {
        id: ids.cashierStaff,
        userId: ids.cashierUser,
        branchId: ids.branch,
        role: StaffRole.CASHIER,
        fullName: 'Cashier One',
        phone: null,
        isActive: true,
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
      },
      {
        id: ids.baristaStaff,
        userId: ids.baristaUser,
        branchId: ids.branch,
        role: StaffRole.BARISTA,
        fullName: 'Barista One',
        phone: null,
        isActive: true,
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
      },
      {
        id: ids.managerStaff,
        userId: ids.managerUser,
        branchId: ids.branch,
        role: StaffRole.MANAGER,
        fullName: 'Manager One',
        phone: null,
        isActive: true,
        branchAssignmentStatus: BranchAssignmentStatus.APPROVED,
      },
    ];
    this.products = [
      {
        id: ids.product,
        branchId: ids.branch,
        name: 'Latte',
        price: 54000,
        isAvailable: true,
      },
    ];
    this.tables = [
      {
        id: ids.table,
        branchId: ids.branch,
        code: 'B-14',
        name: 'B-14',
        status: TableStatus.EMPTY,
      },
      {
        id: ids.table2,
        branchId: ids.branch,
        code: 'B-15',
        name: 'B-15',
        status: TableStatus.EMPTY,
      },
      {
        id: ids.table3,
        branchId: ids.branch,
        code: 'B-16',
        name: 'B-16',
        status: TableStatus.EMPTY,
      },
    ];
    this.shifts = [];
    this.notifications = [];
    this.passwordChangeOtps = [];
  }

  user = {
    findUnique: jest.fn(
      async ({
        where,
        include,
      }: {
        where: { id?: string; email?: string };
        include?: { staff?: boolean };
      }) => {
        const user = this.users.find((u) => u.id === where.id || u.email === where.email);
        if (!user) return null;
        if (include?.staff) {
          return { ...user, staff: this.staffRows.find((s) => s.userId === user.id) ?? null };
        }
        return { ...user };
      },
    ),
    update: jest.fn(
      async ({
        where,
        data,
      }: {
        where: { id: string };
        data: Partial<Pick<UserRow, 'passwordHash'>>;
      }) => {
        const user = this.users.find((u) => u.id === where.id);
        if (!user) throw new Error('User not found');
        Object.assign(user, data);
        return { ...user };
      },
    ),
  };

  staff = {
    findUnique: jest.fn(
      async ({ where, include }: { where: { id: string }; include?: { user?: boolean } }) => {
        const staff = this.staffRows.find((s) => s.id === where.id);
        if (!staff) return null;
        if (include?.user) {
          return { ...staff, user: this.users.find((u) => u.id === staff.userId) };
        }
        return { ...staff };
      },
    ),
    findFirst: jest.fn(async ({ where }: { where: StaffWhere }) => {
      return (
        this.staffRows.find((staff) => {
          if (where.id && staff.id !== where.id) return false;
          if (where.branchId && staff.branchId !== where.branchId) return false;
          if (where.isActive !== undefined && staff.isActive !== where.isActive) return false;
          if (
            where.branchAssignmentStatus &&
            staff.branchAssignmentStatus !== where.branchAssignmentStatus
          ) {
            return false;
          }
          if (typeof where.role === 'string' && staff.role !== where.role) return false;
          if (typeof where.role === 'object') {
            if (where.role.in && !where.role.in.includes(staff.role)) return false;
            if (where.role.not && staff.role === where.role.not) return false;
          }
          return true;
        }) ?? null
      );
    }),
    findMany: jest.fn(
      async ({ where, select }: { where: StaffWhere; select?: { id?: boolean } }) => {
        const rows = this.staffRows.filter((staff) => {
          if (where.branchId && staff.branchId !== where.branchId) return false;
          if (where.isActive !== undefined && staff.isActive !== where.isActive) return false;
          if (typeof where.role === 'string' && staff.role !== where.role) return false;
          if (typeof where.role === 'object') {
            if (where.role.in && !where.role.in.includes(staff.role)) return false;
            if (where.role.not && staff.role === where.role.not) return false;
          }
          return true;
        });
        return select?.id
          ? rows.map((staff) => ({ id: staff.id }))
          : rows.map((staff) => ({ ...staff }));
      },
    ),
  };

  branch = {
    findUnique: jest.fn(async ({ where }: { where: { id: string } }) => {
      const branch = this.branches.find((b) => b.id === where.id);
      return branch ? { ...branch } : null;
    }),
    findFirst: jest.fn(async ({ where }: { where: { id?: string; isActive?: boolean } }) => {
      const branch = this.branches.find((branch) => {
        if (where.id && branch.id !== where.id) return false;
        if (where.isActive !== undefined && branch.isActive !== where.isActive) return false;
        return true;
      });
      return branch ? { ...branch } : null;
    }),
  };

  product = {
    findMany: jest.fn(
      async ({
        where,
      }: {
        where: { id: { in: string[] }; branchId: string; isAvailable: boolean };
      }) => {
        const wanted = new Set(where.id.in);
        return this.products.filter(
          (product) =>
            wanted.has(product.id) &&
            product.branchId === where.branchId &&
            product.isAvailable === where.isAvailable,
        );
      },
    ),
  };

  table = {
    findMany: jest.fn(async ({ where }: { where?: { branchId?: string } }) => {
      return this.tables
        .filter((table) => {
          if (where?.branchId && table.branchId !== where.branchId) return false;
          return true;
        })
        .map((table) => ({ ...table }));
    }),
    findUnique: jest.fn(async ({ where }: { where: { id: string } }) => {
      const table = this.tables.find((row) => row.id === where.id);
      return table ? { ...table } : null;
    }),
    findFirst: jest.fn(async ({ where }: { where: { id: string; branchId: string } }) => {
      return (
        this.tables.find((table) => table.id === where.id && table.branchId === where.branchId) ??
        null
      );
    }),
    updateMany: jest.fn(
      async ({
        where,
        data,
      }: {
        where: { id: string; branchId: string; status: TableStatus };
        data: Partial<TableRow>;
      }) => {
        const table = this.tables.find(
          (row) =>
            row.id === where.id && row.branchId === where.branchId && row.status === where.status,
        );
        if (!table) return { count: 0 };
        Object.assign(table, data);
        return { count: 1 };
      },
    ),
    update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<TableRow> }) => {
      const table = this.tables.find((row) => row.id === where.id);
      if (!table) throw new Error('Table not found');
      Object.assign(table, data);
      return { ...table };
    }),
  };

  order = {
    count: jest.fn(
      async ({
        where,
      }: {
        where: {
          branchId?: string;
          shiftId?: string | null;
          tableId?: string | null;
          createdAt?: { gte?: Date };
          updatedAt?: { gte?: Date; lte?: Date };
          paidAt?: { gte?: Date; lte?: Date };
          status?: OrderStatus | { in?: OrderStatus[]; notIn?: OrderStatus[] };
          OR?: Array<{
            shiftId?: string | null;
            paidAt?: { gte?: Date; lte?: Date };
          }>;
        };
      }) => {
        return this.orders.filter((order) => this.matchesOrderWhere(order, where)).length;
      },
    ),
    findFirst: jest.fn(
      async ({
        where,
      }: {
        where: {
          branchId?: string;
          tableId?: string | null;
          status?: { notIn?: OrderStatus[] };
        };
      }) => {
        const order = this.orders.find((order) => {
          if (where.branchId && order.branchId !== where.branchId) return false;
          if (where.tableId && order.tableId !== where.tableId) return false;
          if (where.status?.notIn && where.status.notIn.includes(order.status)) return false;
          return true;
        });
        return order ? { ...order, items: order.items.map((item) => ({ ...item })) } : null;
      },
    ),
    findMany: jest.fn(
      async ({
        where,
        select,
        orderBy,
        take,
      }: {
        where?: {
          branchId?: string;
          shiftId?: string | null;
          status?: OrderStatus | { in?: OrderStatus[]; notIn?: OrderStatus[] };
          createdAt?: { gte?: Date; lt?: Date; lte?: Date };
          updatedAt?: { gte?: Date; lte?: Date };
          paidAt?: { gte?: Date; lte?: Date };
          tableId?: string | null | { not?: null };
          OR?: Array<{
            shiftId?: string | null;
            paidAt?: { gte?: Date; lte?: Date };
          }>;
        };
        select?: Record<string, unknown>;
        orderBy?: { createdAt?: 'asc' | 'desc' } | Array<Record<string, 'asc' | 'desc'>>;
        take?: number;
      }) => {
        let rows = this.orders.filter((order) => this.matchesOrderWhere(order, where ?? {}));

        if (!Array.isArray(orderBy) && orderBy?.createdAt) {
          rows = rows.sort((a, b) =>
            orderBy.createdAt === 'asc'
              ? a.createdAt.getTime() - b.createdAt.getTime()
              : b.createdAt.getTime() - a.createdAt.getTime(),
          );
        }
        if (take) {
          rows = rows.slice(0, take);
        }

        return rows.map((order) => this.projectOrder(order, select));
      },
    ),
    create: jest.fn(
      async ({
        data,
      }: {
        data: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt' | 'paidAt' | 'items'> & {
          items: { create: OrderItemCreateData[] };
        };
      }) => {
        const now = new Date();
        const order: OrderRecord = {
          id: `88888888-8888-8888-8888-${String(this.orderSeq++).padStart(12, '0')}`,
          branchId: data.branchId,
          shiftId: data.shiftId ?? null,
          tableId: data.tableId,
          orderNumber: data.orderNumber,
          orderType: data.orderType,
          status: data.status,
          subtotal: data.subtotal,
          taxAmount: data.taxAmount,
          total: data.total,
          notes: data.notes,
          createdAt: now,
          updatedAt: now,
          deliveredAt: data.deliveredAt ?? null,
          paidAt: null,
          items: data.items.create.map((item) => ({
            id: `99999999-9999-9999-9999-${String(this.itemSeq++).padStart(12, '0')}`,
            ...item,
            isPrepared: item.isPrepared ?? false,
            preparedAt: item.preparedAt ?? null,
          })),
        };
        this.orders.push(order);
        return { ...order, items: order.items.map((item) => ({ ...item })) };
      },
    ),
    findUnique: jest.fn(async ({ where }: { where: { id: string } }) => {
      const order = this.orders.find((row) => row.id === where.id);
      return order
        ? {
            ...order,
            items: order.items.map((item) => ({ ...item })),
            payments: this.payments
              .filter((payment) => payment.orderId === order.id)
              .map((payment) => ({ ...payment })),
          }
        : null;
    }),
    update: jest.fn(
      async ({
        where,
        data,
      }: {
        where: { id: string };
        data: Partial<Omit<OrderRecord, 'id' | 'items'>>;
      }) => {
        const order = this.orders.find((row) => row.id === where.id);
        if (!order) throw new Error('Order not found');
        Object.assign(order, data, { updatedAt: new Date() });
        return { ...order, items: order.items.map((item) => ({ ...item })) };
      },
    ),
  };

  orderItem = {
    updateMany: jest.fn(
      async ({ where, data }: { where: { orderId?: string }; data: { orderId?: string } }) => {
        if (!where.orderId || !data.orderId) return { count: 0 };
        const source = this.orders.find((order) => order.id === where.orderId);
        const target = this.orders.find((order) => order.id === data.orderId);
        if (!source || !target) return { count: 0 };
        const moved = source.items.splice(0, source.items.length);
        target.items.push(...moved);
        return { count: moved.length };
      },
    ),
    update: jest.fn(
      async ({
        where,
        data,
      }: {
        where: { id: string };
        data: Partial<OrderRecord['items'][number]> & { orderId?: string };
      }) => {
        const found = this.findOrderItem(where.id);
        if (!found) throw new Error('Order item not found');
        Object.assign(found.item, data);
        if (data.orderId && data.orderId !== found.order.id) {
          const target = this.orders.find((order) => order.id === data.orderId);
          if (!target) throw new Error('Target order not found');
          found.order.items.splice(found.index, 1);
          target.items.push(found.item);
        }
        return { ...found.item };
      },
    ),
    create: jest.fn(async ({ data }: { data: OrderItemCreateData & { orderId: string } }) => {
      const order = this.orders.find((row) => row.id === data.orderId);
      if (!order) throw new Error('Order not found');
      const item = {
        id: `99999999-9999-9999-9999-${String(this.itemSeq++).padStart(12, '0')}`,
        productId: data.productId,
        productName: data.productName,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        lineTotal: data.lineTotal,
        notes: data.notes,
        isPrepared: data.isPrepared ?? false,
        preparedAt: data.preparedAt ?? null,
      };
      order.items.push(item);
      return { ...item };
    }),
    delete: jest.fn(async ({ where }: { where: { id: string } }) => {
      const found = this.findOrderItem(where.id);
      if (!found) throw new Error('Order item not found');
      const [item] = found.order.items.splice(found.index, 1);
      return { ...item };
    }),
  };

  payment = {
    create: jest.fn(async ({ data }: { data: Omit<PaymentRow, 'id'> }) => {
      const payment = {
        id: `aaaaaaaa-aaaa-aaaa-aaaa-${String(this.paymentSeq++).padStart(12, '0')}`,
        orderId: data.orderId,
        method: data.method,
        amount: data.amount,
        changeAmount: data.changeAmount,
        reference: data.reference,
        paidAt: data.paidAt,
      };
      this.payments.push(payment);
      return { ...payment };
    }),
  };

  shift = {
    findMany: jest.fn(
      async ({
        where,
        orderBy,
        take,
      }: {
        where: { branchId?: string; status?: ShiftStatus };
        orderBy?: { createdAt?: 'asc' | 'desc' };
        take?: number;
      }) => {
        let rows = this.shifts.filter((shift) => {
          if (where.branchId && shift.branchId !== where.branchId) return false;
          if (where.status && shift.status !== where.status) return false;
          return true;
        });
        if (orderBy?.createdAt) {
          rows = rows.sort((a, b) =>
            orderBy.createdAt === 'asc'
              ? a.createdAt.getTime() - b.createdAt.getTime()
              : b.createdAt.getTime() - a.createdAt.getTime(),
          );
        }
        if (take) {
          rows = rows.slice(0, take);
        }
        return rows.map((shift) => ({ ...shift }));
      },
    ),
    findFirst: jest.fn(
      async ({
        where,
        orderBy,
        select,
      }: {
        where: { branchId?: string; status?: ShiftStatus };
        orderBy?: { createdAt?: 'asc' | 'desc' };
        select?: { id?: boolean };
      }) => {
        const rows = await this.shift.findMany({ where, orderBy, take: 1 });
        const shift = rows[0] ?? null;
        if (!shift) return null;
        return select?.id ? { id: shift.id } : { ...shift };
      },
    ),
    findUnique: jest.fn(async ({ where }: { where: { id: string } }) => {
      const shift = this.shifts.find((row) => row.id === where.id);
      return shift ? { ...shift } : null;
    }),
    create: jest.fn(
      async ({
        data,
      }: {
        data: Omit<
          ShiftRow,
          'id' | 'closedAt' | 'totalRevenue' | 'totalOrders' | 'createdAt' | 'updatedAt'
        >;
      }) => {
        const now = new Date();
        const shift: ShiftRow = {
          id:
            this.shifts.length === 0
              ? ids.shift
              : `dddddddd-dddd-dddd-dddd-${String(this.shifts.length + 1).padStart(12, '0')}`,
          branchId: data.branchId,
          name: data.name,
          shiftType: data.shiftType,
          startTime: data.startTime,
          endTime: data.endTime,
          openedAt: data.openedAt,
          closedAt: null,
          status: data.status,
          totalRevenue: 0,
          totalOrders: 0,
          createdAt: now,
          updatedAt: now,
        };
        this.shifts.push(shift);
        return { ...shift };
      },
    ),
    update: jest.fn(async ({ where, data }: { where: { id: string }; data: Partial<ShiftRow> }) => {
      const shift = this.shifts.find((row) => row.id === where.id);
      if (!shift) throw new Error('Shift not found');
      Object.assign(shift, data, { updatedAt: new Date() });
      return { ...shift };
    }),
  };

  auditLog = {
    create: jest.fn(async () => ({})),
  };

  passwordChangeOtp = {
    updateMany: jest.fn(
      async ({
        where,
        data,
      }: {
        where: { userId?: string; consumedAt?: null };
        data: Partial<Pick<PasswordChangeOtpRow, 'consumedAt'>>;
      }) => {
        let count = 0;
        for (const otp of this.passwordChangeOtps) {
          if (where.userId && otp.userId !== where.userId) continue;
          if (where.consumedAt === null && otp.consumedAt !== null) continue;
          Object.assign(otp, data);
          count += 1;
        }
        return { count };
      },
    ),
    create: jest.fn(
      async ({
        data,
      }: {
        data: Pick<PasswordChangeOtpRow, 'userId' | 'codeHash' | 'newPasswordHash' | 'expiresAt'>;
      }) => {
        const row: PasswordChangeOtpRow = {
          id: `99999999-9999-9999-9999-${String(this.passwordChangeOtpSeq++).padStart(12, '0')}`,
          userId: data.userId,
          codeHash: data.codeHash,
          newPasswordHash: data.newPasswordHash,
          attempts: 0,
          expiresAt: data.expiresAt,
          consumedAt: null,
          createdAt: new Date(),
        };
        this.passwordChangeOtps.push(row);
        return { ...row };
      },
    ),
    findFirst: jest.fn(
      async ({
        where,
        orderBy,
      }: {
        where: { userId: string; consumedAt?: null; expiresAt?: { gte?: Date } };
        orderBy?: { createdAt?: 'asc' | 'desc' };
      }) => {
        let rows = this.passwordChangeOtps.filter((otp) => {
          if (otp.userId !== where.userId) return false;
          if (where.consumedAt === null && otp.consumedAt !== null) return false;
          if (where.expiresAt?.gte && otp.expiresAt < where.expiresAt.gte) return false;
          return true;
        });
        if (orderBy?.createdAt === 'desc') {
          rows = [...rows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        return rows[0] ? { ...rows[0] } : null;
      },
    ),
    update: jest.fn(
      async ({
        where,
        data,
      }: {
        where: { id: string };
        data: Partial<Pick<PasswordChangeOtpRow, 'consumedAt'>> & {
          attempts?: { increment: number } | number;
        };
      }) => {
        const otp = this.passwordChangeOtps.find((row) => row.id === where.id);
        if (!otp) throw new Error('Password change OTP not found');
        if (typeof data.attempts === 'object') {
          otp.attempts += data.attempts.increment;
        } else if (typeof data.attempts === 'number') {
          otp.attempts = data.attempts;
        }
        if (data.consumedAt !== undefined) {
          otp.consumedAt = data.consumedAt;
        }
        return { ...otp };
      },
    ),
  };

  private matchesOrderWhere(
    order: OrderRecord,
    where: {
      branchId?: string;
      shiftId?: string | null;
      tableId?: string | null | { not?: null };
      createdAt?: { gte?: Date; lt?: Date; lte?: Date };
      updatedAt?: { gte?: Date; lte?: Date };
      paidAt?: { gte?: Date; lte?: Date };
      status?: OrderStatus | { in?: OrderStatus[]; notIn?: OrderStatus[] };
      OR?: Array<{
        shiftId?: string | null;
        paidAt?: { gte?: Date; lte?: Date };
      }>;
    },
  ): boolean {
    if (where.branchId && order.branchId !== where.branchId) return false;
    if (where.shiftId !== undefined && order.shiftId !== where.shiftId) return false;
    if (typeof where.tableId === 'string' && order.tableId !== where.tableId) return false;
    if (where.tableId && typeof where.tableId === 'object' && 'not' in where.tableId) {
      if (where.tableId.not === null && order.tableId === null) return false;
    }
    if (where.createdAt?.gte && order.createdAt < where.createdAt.gte) return false;
    if (where.createdAt?.lt && order.createdAt >= where.createdAt.lt) return false;
    if (where.createdAt?.lte && order.createdAt > where.createdAt.lte) return false;
    if (where.updatedAt?.gte && order.updatedAt < where.updatedAt.gte) return false;
    if (where.updatedAt?.lte && order.updatedAt > where.updatedAt.lte) return false;
    if (where.paidAt?.gte && (!order.paidAt || order.paidAt < where.paidAt.gte)) return false;
    if (where.paidAt?.lte && (!order.paidAt || order.paidAt > where.paidAt.lte)) return false;
    if (typeof where.status === 'string' && order.status !== where.status) return false;
    if (typeof where.status === 'object') {
      if (where.status.in && !where.status.in.includes(order.status)) return false;
      if (where.status.notIn && where.status.notIn.includes(order.status)) return false;
    }
    if (where.OR?.length) {
      const matchedOr = where.OR.some((clause) => {
        if (clause.shiftId !== undefined && order.shiftId !== clause.shiftId) return false;
        if (clause.paidAt?.gte && (!order.paidAt || order.paidAt < clause.paidAt.gte)) {
          return false;
        }
        if (clause.paidAt?.lte && (!order.paidAt || order.paidAt > clause.paidAt.lte)) {
          return false;
        }
        return true;
      });
      if (!matchedOr) return false;
    }
    return true;
  }

  private findOrderItem(
    itemId: string,
  ): { order: OrderRecord; item: OrderRecord['items'][number]; index: number } | null {
    for (const order of this.orders) {
      const index = order.items.findIndex((item) => item.id === itemId);
      if (index >= 0) {
        return { order, item: order.items[index], index };
      }
    }
    return null;
  }

  private projectOrder(order: OrderRecord, select?: Record<string, unknown>) {
    const full = {
      ...order,
      items: order.items.map((item) => ({ ...item })),
      payments: this.payments
        .filter((payment) => payment.orderId === order.id)
        .map((payment) => ({ ...payment })),
    };
    if (!select) {
      return full;
    }

    const projected: Record<string, unknown> = {};
    for (const key of Object.keys(select)) {
      if (key === 'items') {
        projected.items = order.items.map((item) => ({ ...item }));
      } else {
        projected[key] = full[key as keyof typeof full];
      }
    }
    return projected;
  }

  notification = {
    createMany: jest.fn(
      async ({
        data,
      }: {
        data: Array<Omit<NotificationRow, 'id' | 'readAt' | 'createdAt'> & { readAt?: Date }>;
      }) => {
        const now = new Date();
        const created = data.map((entry) => ({
          id: `eeeeeeee-eeee-eeee-eeee-${String(this.notificationSeq++).padStart(12, '0')}`,
          branchId: entry.branchId,
          staffId: entry.staffId,
          type: entry.type,
          title: entry.title,
          body: entry.body,
          readAt: entry.readAt ?? null,
          metadata: entry.metadata ?? null,
          createdAt: now,
        }));
        this.notifications.push(...created);
        return { count: created.length };
      },
    ),
    findMany: jest.fn(
      async ({
        where,
        orderBy,
        take,
      }: {
        where: { staffId?: string };
        orderBy?: { createdAt?: 'asc' | 'desc' };
        take?: number;
      }) => {
        let rows = this.notifications.filter((notification) => {
          if (where.staffId && notification.staffId !== where.staffId) return false;
          return true;
        });
        if (orderBy?.createdAt) {
          rows = rows.sort((a, b) =>
            orderBy.createdAt === 'asc'
              ? a.createdAt.getTime() - b.createdAt.getTime()
              : b.createdAt.getTime() - a.createdAt.getTime(),
          );
        }
        if (take) {
          rows = rows.slice(0, take);
        }
        return rows.map((notification) => ({ ...notification }));
      },
    ),
    count: jest.fn(
      async ({ where }: { where: { staffId?: string; readAt?: null } }) =>
        this.notifications.filter((notification) => {
          if (where.staffId && notification.staffId !== where.staffId) return false;
          if ('readAt' in where && notification.readAt !== where.readAt) return false;
          return true;
        }).length,
    ),
    updateMany: jest.fn(
      async ({
        where,
        data,
      }: {
        where: { id?: string; staffId?: string; readAt?: null };
        data: { readAt?: Date };
      }) => {
        let count = 0;
        for (const notification of this.notifications) {
          if (where.id && notification.id !== where.id) continue;
          if (where.staffId && notification.staffId !== where.staffId) continue;
          if ('readAt' in where && notification.readAt !== where.readAt) continue;
          Object.assign(notification, data);
          count++;
        }
        return { count };
      },
    ),
  };

  $transaction = jest.fn(async (callback: (tx: InMemoryPrisma) => Promise<unknown>) =>
    callback(this),
  );
}

describe('API auth, order, and payment flows', () => {
  let app: INestApplication;
  let prisma: InMemoryPrisma;
  let sentPasswordCode: string | null = null;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/caffeapp_test';
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_IN = '7d';

    prisma = new InMemoryPrisma();
    await prisma.seed();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .overrideProvider(EmailService)
      .useValue({
        sendPasswordChangeCode: jest.fn(async ({ code }: { code: string }) => {
          sentPasswordCode = code;
        }),
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  async function login(email: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password123' })
      .expect(200);

    expect(response.body.data.accessToken).toEqual(expect.any(String));
    return response.body.data.accessToken as string;
  }

  async function createReadyDeliveredOrder(cashierToken: string, baristaToken: string) {
    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.TAKE_AWAY,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    const orderId = created.body.data.id;
    expect(created.body.data.status).toBe(OrderStatus.PENDING);

    const making = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ status: OrderStatus.MAKING })
      .expect(200);
    expect(making.body.data.status).toBe(OrderStatus.MAKING);

    const ready = await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${baristaToken}`)
      .send({ status: OrderStatus.READY })
      .expect(200);
    expect(ready.body.data.status).toBe(OrderStatus.READY);

    const delivered = await request(app.getHttpServer())
      .post(`/orders/${orderId}/deliver`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({})
      .expect(201);
    expect(delivered.body.data.status).toBe(OrderStatus.READY);
    expect(delivered.body.data.deliveredAt).toEqual(expect.any(String));

    return orderId as string;
  }

  it('logs in and returns the current user from /auth/me', async () => {
    const token = await login('cashier@caffe.app');

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body.data.user.email).toBe('cashier@caffe.app');
    expect(me.body.data.staff.role).toBe(StaffRole.CASHIER);
    expect(me.body.data.branch.id).toBe(ids.branch);
    expect(me.body.data.branch.bankInfo.account).toBe('1023456789');
  });

  it('returns branch bank info for VietQR payments', async () => {
    const token = await login('cashier@caffe.app');

    const response = await request(app.getHttpServer())
      .get('/branches')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data[0].bankInfo).toEqual({
      bank: 'Vietcombank',
      bankCode: 'VCB',
      account: '1023456789',
      holder: 'CTY TNHH CA PHE PILOT',
    });
  });

  it('attaches the active open shift to newly created orders', async () => {
    const managerToken = await login('manager@caffe.app');
    const cashierToken = await login('cashier@caffe.app');

    const shift = await request(app.getHttpServer())
      .post('/shifts/open')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        branchId: ids.branch,
        name: 'Ca sáng',
        shiftType: 'morning',
        startTime: '07:00',
        endTime: '15:00',
      })
      .expect(201);

    expect(shift.body.data).toMatchObject({
      id: ids.shift,
      branchId: ids.branch,
      status: ShiftStatus.OPEN,
    });

    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.TAKE_AWAY,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    expect(created.body.data.shiftId).toBe(ids.shift);
  });

  it('lets managers toggle a table to maintenance and blocks new dine-in orders', async () => {
    const managerToken = await login('manager@caffe.app');
    const cashierToken = await login('cashier@caffe.app');

    const maintenance = await request(app.getHttpServer())
      .patch(`/tables/${ids.table}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: TableStatus.MAINTENANCE })
      .expect(200);

    expect(maintenance.body.data.status).toBe(TableStatus.MAINTENANCE);

    await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.DINE_IN,
        tableId: ids.table,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(400);

    const reopened = await request(app.getHttpServer())
      .patch(`/tables/${ids.table}/status`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: TableStatus.EMPTY })
      .expect(200);

    expect(reopened.body.data.status).toBe(TableStatus.EMPTY);
  });

  it('transfers a dine-in order and merges when moving into an occupied table', async () => {
    const cashierToken = await login('cashier@caffe.app');

    const first = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.DINE_IN,
        tableId: ids.table,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    const transferred = await request(app.getHttpServer())
      .patch(`/orders/${first.body.data.id}/table`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ tableId: ids.table2 })
      .expect(200);

    expect(transferred.body.data.tableId).toBe(ids.table2);

    const second = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.DINE_IN,
        tableId: ids.table3,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch(`/orders/${second.body.data.id}/table`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ tableId: ids.table2 })
      .expect(409);

    const merged = await request(app.getHttpServer())
      .patch(`/orders/${second.body.data.id}/table`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ tableId: ids.table2, mergeIntoOccupied: true })
      .expect(200);

    expect(merged.body.data.id).toBe(first.body.data.id);
    expect(merged.body.data.tableId).toBe(ids.table2);
    expect(merged.body.data.items).toHaveLength(2);
    expect(merged.body.data.total).toBe(108000);

    const source = await request(app.getHttpServer())
      .get(`/orders/${second.body.data.id}`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(source.body.data.status).toBe(OrderStatus.CANCELLED);
    expect(source.body.data.total).toBe(0);
  });

  it('merges multiple active orders into one bill', async () => {
    const cashierToken = await login('cashier@caffe.app');

    const target = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.TAKE_AWAY,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    const sourceOne = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.TAKE_AWAY,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    const sourceTwo = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.TAKE_AWAY,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    const merged = await request(app.getHttpServer())
      .post('/orders/merge')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        targetOrderId: target.body.data.id,
        sourceOrderIds: [sourceOne.body.data.id, sourceTwo.body.data.id],
      })
      .expect(201);

    expect(merged.body.data.id).toBe(target.body.data.id);
    expect(merged.body.data.items).toHaveLength(3);
    expect(merged.body.data.total).toBe(162000);

    const source = await request(app.getHttpServer())
      .get(`/orders/${sourceOne.body.data.id}`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(source.body.data.status).toBe(OrderStatus.CANCELLED);
  });

  it('splits selected item quantity into a new bill', async () => {
    const cashierToken = await login('cashier@caffe.app');

    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.TAKE_AWAY,
        items: [{ productId: ids.product, quantity: 3, unitPrice: 54000 }],
      })
      .expect(201);

    const split = await request(app.getHttpServer())
      .post(`/orders/${created.body.data.id}/split`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        items: [{ itemId: created.body.data.items[0].id, quantity: 1 }],
      })
      .expect(201);

    expect(split.body.data.sourceOrder.id).toBe(created.body.data.id);
    expect(split.body.data.sourceOrder.items[0].quantity).toBe(2);
    expect(split.body.data.sourceOrder.total).toBe(108000);
    expect(split.body.data.splitOrder.items[0].quantity).toBe(1);
    expect(split.body.data.splitOrder.total).toBe(54000);
  });

  it('runs the order lifecycle without SERVING', async () => {
    const cashierToken = await login('cashier@caffe.app');
    const baristaToken = await login('barista@caffe.app');
    const orderId = await createReadyDeliveredOrder(cashierToken, baristaToken);

    const fetched = await request(app.getHttpServer())
      .get(`/orders/${orderId}`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(fetched.body.data.status).toBe(OrderStatus.READY);
    expect(fetched.body.data.status).not.toBe('SERVING');
    expect(Object.values(OrderStatus)).not.toContain('SERVING');
  });

  it('locks table B-14 after a dine-in order is sent to the kitchen', async () => {
    const cashierToken = await login('cashier@caffe.app');

    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.DINE_IN,
        tableId: ids.table,
        notes: 'B-14 lock check',
        items: [
          {
            productId: ids.product,
            quantity: 1,
            unitPrice: 54000,
            notes: 'Size M, Đường Ít, Đá Ít',
          },
        ],
      })
      .expect(201);

    expect(created.body.data).toMatchObject({
      tableId: ids.table,
      orderType: OrderType.DINE_IN,
      status: OrderStatus.PENDING,
      notes: 'B-14 lock check',
    });
    expect(created.body.data.items[0].notes).toBe('Size M, Đường Ít, Đá Ít');

    const conflict = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.DINE_IN,
        tableId: ids.table,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(409);

    expect(conflict.body.message).toEqual(expect.stringContaining('Bàn'));
  });

  it('creates ORDER_READY notifications and supports unread/read actions', async () => {
    const cashierToken = await login('cashier@caffe.app');
    const baristaToken = await login('barista@caffe.app');

    const beforeUnread = await request(app.getHttpServer())
      .get('/notifications/unread-count')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    const created = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        branchId: ids.branch,
        orderType: OrderType.TAKE_AWAY,
        items: [{ productId: ids.product, quantity: 1, unitPrice: 54000 }],
      })
      .expect(201);

    const orderId = created.body.data.id as string;

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ status: OrderStatus.MAKING })
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${baristaToken}`)
      .send({ status: OrderStatus.READY })
      .expect(200);

    const afterUnread = await request(app.getHttpServer())
      .get('/notifications/unread-count')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(afterUnread.body.data.count).toBe(beforeUnread.body.data.count + 1);

    const list = await request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    const readyNotification = list.body.data.find(
      (notification: { id: string; type: NotificationType; metadata?: { orderId?: string } }) =>
        notification.type === NotificationType.ORDER_READY &&
        notification.metadata?.orderId === orderId,
    );
    expect(readyNotification).toMatchObject({
      type: NotificationType.ORDER_READY,
      readAt: null,
    });

    await request(app.getHttpServer())
      .patch(`/notifications/${readyNotification.id}/read`)
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    const afterMarkRead = await request(app.getHttpServer())
      .get('/notifications/unread-count')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(afterMarkRead.body.data.count).toBe(afterUnread.body.data.count - 1);

    await request(app.getHttpServer())
      .post('/notifications/read-all')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(201);

    const afterMarkAll = await request(app.getHttpServer())
      .get('/notifications/unread-count')
      .set('Authorization', `Bearer ${cashierToken}`)
      .expect(200);

    expect(afterMarkAll.body.data.count).toBe(0);
  });

  it('accepts CASH payment and returns change', async () => {
    const cashierToken = await login('cashier@caffe.app');
    const baristaToken = await login('barista@caffe.app');
    const orderId = await createReadyDeliveredOrder(cashierToken, baristaToken);

    const payment = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ orderId, method: PaymentMethod.CASH, amount: 60000 })
      .expect(201);

    expect(payment.body.data).toMatchObject({
      orderId,
      method: PaymentMethod.CASH,
      amount: 60000,
      changeAmount: 6000,
    });
  });

  it('rejects non-pilot payment methods', async () => {
    const cashierToken = await login('cashier@caffe.app');
    const baristaToken = await login('barista@caffe.app');
    const orderId = await createReadyDeliveredOrder(cashierToken, baristaToken);

    const response = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({ orderId, method: PaymentMethod.CARD, amount: 54000 })
      .expect(400);

    expect(response.body.message).toBe('Pilot chỉ hỗ trợ tiền mặt hoặc chuyển khoản');
  });

  it('accepts BANK_TRANSFER payment with a manual reference', async () => {
    const cashierToken = await login('cashier@caffe.app');
    const baristaToken = await login('barista@caffe.app');
    const orderId = await createReadyDeliveredOrder(cashierToken, baristaToken);

    const payment = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${cashierToken}`)
      .send({
        orderId,
        method: PaymentMethod.BANK_TRANSFER,
        amount: 54000,
        reference: 'VCB-MANUAL-001',
      })
      .expect(201);

    expect(payment.body.data).toMatchObject({
      orderId,
      method: PaymentMethod.BANK_TRANSFER,
      amount: 54000,
      changeAmount: null,
      reference: 'VCB-MANUAL-001',
    });
  });

  it('changes password after verifying email OTP code', async () => {
    const managerToken = await login('manager@caffe.app');
    sentPasswordCode = null;

    await request(app.getHttpServer())
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ currentPassword: 'wrong-password', newPassword: 'newpassword123' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ currentPassword: 'password123', newPassword: 'newpassword123' })
      .expect(200);

    expect(sentPasswordCode).toMatch(/^\d{6}$/);

    await request(app.getHttpServer())
      .post('/auth/change-password/confirm')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ code: '000000' })
      .expect(400);

    await request(app.getHttpServer())
      .post('/auth/change-password/confirm')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ code: sentPasswordCode })
      .expect(200);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'manager@caffe.app', password: 'password123' })
      .expect(401);

    const relogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'manager@caffe.app', password: 'newpassword123' })
      .expect(200);

    expect(relogin.body.data.accessToken).toEqual(expect.any(String));
  });
});
