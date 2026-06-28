-- =============================================================================
-- LEGACY — READ ONLY / ARCHIVED (Supabase Sprint 0)
-- Superseded by apps/api/prisma/schema.prisma
-- Do not run against production database.
-- =============================================================================
-- CaffeApp MVP — Initial Schema
-- Migration: 001_initial_schema

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE app_role AS ENUM ('cashier', 'barista', 'manager');
CREATE TYPE order_status AS ENUM ('DRAFT', 'PENDING', 'IN_PROGRESS', 'READY', 'PAID', 'COMPLETED', 'CANCELLED');
CREATE TYPE order_type AS ENUM ('DINE_IN', 'TAKEAWAY');
CREATE TYPE table_status AS ENUM ('EMPTY', 'OCCUPIED', 'MAINTENANCE');
CREATE TYPE payment_method AS ENUM ('CASH', 'BANK_TRANSFER', 'CARD', 'E_WALLET');
CREATE TYPE payment_record_status AS ENUM ('PENDING', 'COMPLETED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('UNPAID', 'PAID', 'REFUNDED');
CREATE TYPE sugar_level AS ENUM ('NONE', 'LESS', 'NORMAL', 'EXTRA');
CREATE TYPE ice_level AS ENUM ('NONE', 'LESS', 'NORMAL', 'EXTRA');
CREATE TYPE item_size AS ENUM ('S', 'M', 'L');
CREATE TYPE shift_type AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');
CREATE TYPE shift_status AS ENUM ('OPEN', 'CLOSED');
CREATE TYPE notification_type AS ENUM ('ORDER_READY', 'ORDER_NEW', 'TABLE_WARNING', 'LOW_STOCK', 'SHIFT_START', 'SYSTEM');

-- Tables
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    bank_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, branch_id, role)
);

CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    floor TEXT DEFAULT 'Tầng 1',
    capacity INT DEFAULT 4,
    status table_status DEFAULT 'EMPTY',
    locked_by UUID REFERENCES employees(id),
    locked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, code)
);

CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(branch_id, slug)
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    cost_price DECIMAL(12,2),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    size_options JSONB DEFAULT '["S","M","L"]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    shift_type shift_type NOT NULL,
    start_time TIME,
    end_time TIME,
    opened_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    opened_by UUID REFERENCES employees(id),
    total_revenue DECIMAL(14,2) DEFAULT 0,
    total_orders INT DEFAULT 0,
    status shift_status DEFAULT 'OPEN'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    table_id UUID REFERENCES tables(id),
    shift_id UUID REFERENCES shifts(id),
    created_by UUID REFERENCES employees(id),
    order_number TEXT NOT NULL,
    order_type order_type NOT NULL,
    status order_status DEFAULT 'DRAFT',
    payment_status payment_status DEFAULT 'UNPAID',
    subtotal DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) DEFAULT 0,
    notes TEXT,
    sent_to_kitchen_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    item_name TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    size item_size DEFAULT 'M',
    sugar_level sugar_level DEFAULT 'NORMAL',
    ice_level ice_level DEFAULT 'NORMAL',
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id),
    processed_by UUID REFERENCES employees(id),
    method payment_method NOT NULL,
    e_wallet_provider TEXT,
    amount DECIMAL(12,2) NOT NULL,
    amount_received DECIMAL(12,2),
    change_amount DECIMAL(12,2),
    status payment_record_status DEFAULT 'COMPLETED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_branch_status ON orders(branch_id, status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_tables_branch_status ON tables(branch_id, status);
CREATE INDEX idx_menu_items_branch_category ON menu_items(branch_id, category_id);
CREATE INDEX idx_notifications_employee_unread ON notifications(employee_id, is_read);

-- Enable RLS
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
