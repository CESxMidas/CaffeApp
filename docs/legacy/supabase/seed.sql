-- CaffeApp MVP — Seed data for pilot branch
-- Run after 001_initial_schema.sql

-- Branch
INSERT INTO branches (id, name, address, phone, bank_info) VALUES
('a0000000-0000-0000-0000-000000000001', 'CN Quận 1', '123 Nguyễn Huệ, Q.1, TP.HCM', '0281234567',
 '{"bank":"Vietcombank","account":"1234567890","holder":"Cafe ABC"}');

-- Categories
INSERT INTO menu_categories (id, branch_id, name, slug, sort_order) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Cà phê', 'coffee', 1),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Trà', 'tea', 2),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Bánh', 'pastry', 3);

-- Menu items
INSERT INTO menu_items (branch_id, category_id, name, price, description) VALUES
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Cà phê sữa', 45000, 'Cà phê phin + sữa đặc'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Cà phê đen', 35000, 'Cà phê phin đen'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Bạc xỉu', 40000, 'Nhiều sữa ít cà phê'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Cappuccino', 55000, 'Espresso + sữa foam'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Latte', 55000, 'Espresso + sữa tươi'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Trà đào', 45000, 'Trà đen + đào tươi'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Trà sữa trân châu', 50000, 'Trà sữa Đài Loan'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Bánh croissant', 35000, 'Bánh sừng bò'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Bánh tiramisu', 45000, 'Bánh Ý');

-- Tables B01-B12
INSERT INTO tables (branch_id, code, floor, capacity, status)
SELECT 'a0000000-0000-0000-0000-000000000001', 'B' || LPAD(n::text, 2, '0'), 'Tầng 1', 4, 'EMPTY'
FROM generate_series(1, 12) AS n;

-- Open morning shift
INSERT INTO shifts (branch_id, name, shift_type, start_time, end_time, opened_at, status)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Ca sáng', 'MORNING', '06:00', '14:00', NOW(), 'OPEN');
