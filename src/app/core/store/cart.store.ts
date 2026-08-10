import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { Product } from '../../shared/models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

// Загружаем сохраненную корзину из localStorage
const initialItems: CartItem[] = JSON.parse(localStorage.getItem('cart_items') || '[]');

export const cartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>({ items: initialItems }),
  withComputed((store) => ({
    totalCount: computed(() => store.items().reduce((acc, item) => acc + item.quantity, 0)),
    totalPrice: computed(() => store.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0))
  })),
  withMethods((store) => ({
    addToCart(product: Product) {
      const currentItems = store.items();
      const existing = currentItems.find((i) => i.product.id === product.id);
      let updatedItems: CartItem[];

      if (existing) {
        updatedItems = currentItems.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedItems = [...currentItems, { product, quantity: 1 }];
      }

      localStorage.setItem('cart_items', JSON.stringify(updatedItems));
      patchState(store, { items: updatedItems });
    },
    decreaseQuantity(productId: number) {
      const currentItems = store.items();
      const existing = currentItems.find((i) => i.product.id === productId);
      if (!existing) return;

      let updatedItems: CartItem[];
      if (existing.quantity > 1) {
        updatedItems = currentItems.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        );
      } else {
        updatedItems = currentItems.filter((i) => i.product.id !== productId);
      }

      localStorage.setItem('cart_items', JSON.stringify(updatedItems));
      patchState(store, { items: updatedItems });
    },
    removeFromCart(productId: number) {
      const updatedItems = store.items().filter((i) => i.product.id !== productId);
      localStorage.setItem('cart_items', JSON.stringify(updatedItems));
      patchState(store, { items: updatedItems });
    },
    clearCart() {
      localStorage.removeItem('cart_items');
      patchState(store, { items: [] });
    }
  }))
);