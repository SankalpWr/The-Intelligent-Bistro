import { create } from 'zustand';
import { MenuItem } from '../constants/menu';

export type CartEntry = {
  item: MenuItem;
  quantity: number;
  selectedSize?: string;
  specialInstructions?: string;
};

type CartStore = {
  entries: CartEntry[];
  addItem: (item: MenuItem, qty?: number, size?: string) => void;
  removeItem: (itemId: string, size?: string) => void;
  updateQuantity: (itemId: string, qty: number, size?: string) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
};

const matches = (e: CartEntry, itemId: string, size?: string) =>
  e.item.id === itemId && (e.selectedSize ?? undefined) === (size ?? undefined);

export const useCartStore = create<CartStore>((set, get) => ({
  entries: [],

  addItem: (item, qty = 1, size) =>
    set((state) => {
      const existing = state.entries.find((e) => matches(e, item.id, size));
      if (existing) {
        return {
          entries: state.entries.map((e) =>
            matches(e, item.id, size) ? { ...e, quantity: e.quantity + qty } : e,
          ),
        };
      }
      return {
        entries: [
          ...state.entries,
          { item, quantity: qty, selectedSize: size },
        ],
      };
    }),

  removeItem: (itemId, size) =>
    set((state) => ({
      entries: state.entries.filter((e) => !matches(e, itemId, size)),
    })),

  updateQuantity: (itemId, qty, size) =>
    set((state) => ({
      entries:
        qty <= 0
          ? state.entries.filter((e) => !matches(e, itemId, size))
          : state.entries.map((e) =>
              matches(e, itemId, size) ? { ...e, quantity: qty } : e,
            ),
    })),

  clearCart: () => set({ entries: [] }),

  total: () =>
    get().entries.reduce((sum, e) => {
      const sizeModifier =
        e.item.sizes?.find((s) => s.label === e.selectedSize)?.priceModifier ??
        0;
      return sum + (e.item.price + sizeModifier) * e.quantity;
    }, 0),

  itemCount: () =>
    get().entries.reduce((sum, e) => sum + e.quantity, 0),
}));

export const computeEntryPrice = (entry: CartEntry): number => {
  const sizeModifier =
    entry.item.sizes?.find((s) => s.label === entry.selectedSize)
      ?.priceModifier ?? 0;
  return (entry.item.price + sizeModifier) * entry.quantity;
};
