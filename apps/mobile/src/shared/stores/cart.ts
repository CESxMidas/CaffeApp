import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
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

// EC-10: draft cart survives app kill / session expiry, stored encrypted.
// SecureStore is native-only; web dev falls back to localStorage.
const draftStorage = createJSONStorage(() => ({
  getItem: (name: string) =>
    Platform.OS === 'web'
      ? (typeof localStorage !== 'undefined' ? localStorage.getItem(name) : null)
      : SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(name, value);
      return;
    }
    return SecureStore.setItemAsync(name, value);
  },
  removeItem: (name: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(name);
      return;
    }
    return SecureStore.deleteItemAsync(name);
  },
}));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
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
          items: [...s.items, { ...item, id: `line-${Date.now()}-${++lineId}` }],
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
    }),
    {
      name: 'caffeapp_draft_cart',
      storage: draftStorage,
      partialize: (s) => ({
        branchId: s.branchId,
        orderType: s.orderType,
        tableId: s.tableId,
        tableCode: s.tableCode,
        items: s.items,
      }),
    },
  ),
);
