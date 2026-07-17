import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart-service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../shared/models/cart-item';


@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  private cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalItemsPrice;
  totalItemsCount = this.cartService.totalItemsCount;

  onIncrease(item: CartItem): void {
    this.cartService.addToCart(item.product);
  }

  onDecrease(item: CartItem): void {
    this.cartService.decreaseQuantity(item.product.id);
  }

  onRemove(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onCheckout(): void {
    alert('Thank you for your purchase');
    this.cartService.clearCart();
  }
}
