import { create } from 'zustand';
import type { OrderType } from '@caffeapp/shared';

export interface CartLineItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  notes: string | null;
}

interface CartState {
  branchId: string | null;
  orderType: OrderType | null;
  tableId: string | null;
  tableCode: string | null;
  items: CartLineItem[];
  startOrder: (params: {
    branchId: string;
    orderType: OrderType;
    tableId?: string | null;
    tableCode?: string | null;
  }) => void;
  addItem: (item: Omit<CartLineItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

let lineId = 0;

export const useCartStore = create<CartState>((set, get) => ({
  branchId: null,
  orderType: null,
  tableId: null,
  tableCode: null,
  items: [],

  startOrder: ({ branchId, orderType, tableId = null, tableCode = null }) => {
    set({ branchId, orderType, tableId, tableCode, items: [] });
  },

  addItem: (item) => {
    set((s) => ({
      items: [...s.items, { ...item, id: `line-${++lineId}` }],
    }));
  },

  removeItem: (id) => {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) {
      get().removeItem(id);
      return;
    }
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => {
    set({ branchId: null, orderType: null, tableId: null, tableCode: null, items: [] });
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
}));
