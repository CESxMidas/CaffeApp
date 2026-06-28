-- AlterEnum: thêm trạng thái SERVING (đã giao nước / đang phục vụ) trước thanh toán
ALTER TYPE "OrderStatus" ADD VALUE 'SERVING';
