import { Platform } from 'react-native';
import { useCartStore } from '../store/cartStore';
import { MENU } from '../constants/menu';

const DEFAULT_DEV_HOST = Platform.select({
  android: 'http://10.0.2.2:3001',
  ios: 'http://localhost:3001',
  default: 'http://localhost:3001',
});

/**
 * Production:
 * - Web (e.g. Vercel): same-origin `/api`
 * - Native: set EXPO_PUBLIC_API_URL to your deployed origin (no trailing slash)
 */
function getApiBase(): string {
  if (__DEV__) {
    return `${DEFAULT_DEV_HOST}/api`;
  }
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');
  if (envUrl) {
    return `${envUrl}/api`;
  }
  if (Platform.OS === 'web') {
    return '/api';
  }
  return 'https://your-production-url.com/api';
}

const API_BASE = getApiBase();

export type AIAction = {
  type: 'ADD' | 'REMOVE' | 'UPDATE_QTY' | 'CLEAR';
  itemId?: string;
  quantity?: number;
  size?: 'Small' | 'Large' | null;
};

export type AIOrderResponse = {
  reply: string;
  actions: AIAction[];
  cartSummary?: string;
};

export async function parseOrderMessage(
  message: string,
): Promise<AIOrderResponse> {
  const { entries, addItem, removeItem, updateQuantity, clearCart } =
    useCartStore.getState();

  const cartContext = entries.map((e) => ({
    id: e.item.id,
    name: e.item.name,
    qty: e.quantity,
    size: e.selectedSize ?? null,
  }));

  const res = await fetch(`${API_BASE}/parse-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, cartContext }),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const errBody = await res.json();
      detail = errBody?.details || errBody?.error || '';
    } catch {
      // ignore
    }
    throw new Error(`API error (${res.status})${detail ? `: ${detail}` : ''}`);
  }

  const data = (await res.json()) as AIOrderResponse;

  for (const action of data.actions ?? []) {
    if (action.type === 'CLEAR') {
      clearCart();
      continue;
    }
    if (!action.itemId) continue;
    const menuItem = MENU.find((m) => m.id === action.itemId);
    if (!menuItem) continue;

    if (action.type === 'ADD') {
      addItem(menuItem, action.quantity ?? 1, action.size ?? undefined);
    } else if (action.type === 'REMOVE') {
      removeItem(menuItem.id, action.size ?? undefined);
    } else if (action.type === 'UPDATE_QTY' && action.quantity !== undefined) {
      updateQuantity(
        menuItem.id,
        action.quantity,
        action.size ?? undefined,
      );
    }
  }

  return data;
}
