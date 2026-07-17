import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../shared/models/product';
import { CartItem } from '../../shared/models/cart-item';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemSignal = signal<CartItem[]>([]);

    readonly cartItems = this.cartItemSignal.asReadonly();

    readonly totalItemsPrice = computed(() => {
        return this.cartItemSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
    })

    readonly totalItemsCount = computed(() => {
        return this.cartItemSignal().reduce((acc, item) => acc + item.quantity, 0)
    })



    addToCart(product: Product): void{
        const items = this.cartItemSignal();
        const existingItem = items.find(item => item.product.id === product.id);


        if(existingItem){
            this.cartItemSignal.set(
                items.map(item => 
                    item.product.id === product.id
                    ? {...item, quantity: item.quantity + 1}
                    : item
                )
            );
        }else {
            this.cartItemSignal.set([...items, {product, quantity: 1}])
        }
    }

    removeFromCart(productId: number): void{
        this.cartItemSignal.set(
            this.cartItemSignal().filter(item => item.product.id !== productId)
        )
    }
    
    decreaseQuantity(productId: number): void{
        const items = this.cartItemSignal();
        const existingItem = items.find(item => item.product.id === productId);

        if(existingItem){
            if(existingItem.quantity > 1){
                this.cartItemSignal.set(
                    items.map(item =>
                        item.product.id === productId
                        ? {...item, quantity: item.quantity - 1}
                        : item
                    )
                );
            }else{
                this.removeFromCart(productId);
            }
        }
    }

    clearCart(): void {
        this.cartItemSignal.set([]);
    }
}
