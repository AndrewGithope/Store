import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { CartItem } from '../../shared/models/cart-item';
import { Product } from '../../shared/models/product';


interface CartState {
    items: CartItem[];
}


const initialState: CartState = {
    items: [],
};

export const cartStore = signalStore(
    withState(initialState),
    withComputed((store) => ({
        totalCount: computed(() => 
        store.items().reduce((acc, item) => acc + item.quantity, 0)
    ),
    totalPrice: computed(() =>
    store.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    )
    })),
    withMethods((store) => ({
        addToCart(product: Product): void {
            const curremtItems = store.items();
            const existingIndex = curremtItems.findIndex(i => i.product.id === product.id);

            if(existingIndex > -1){
                const updated = [...curremtItems];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1
                };
                patchState(store, {items: updated});
            }else {
                patchState(store, {items: [...curremtItems, {product, quantity: 1}] });
            }
        },

        removeFromCart(productId: number): void {
            patchState(store, {
                items: store.items().filter(item => item.product.id !== productId)
            });
        },

        clearCart(): void {
            patchState(store, {items: []});
        }
    }))
);






