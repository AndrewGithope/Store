import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../shared/models/cart-item';
import { cartStore } from '../../core/store/cart.store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutDialogComponent } from '../../shared/components/checkout-dialog/checkout-dialog.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  readonly cartStore = inject(cartStore);
  private dialog = inject(MatDialog);

  openCheckout(): void {
    this.dialog.open(CheckoutDialogComponent, {
      width: '500px',
      disableClose: true
    });
  }

  onIncrease(item: CartItem): void {
    this.cartStore.addToCart(item.product);
  }

  onDecrease(item: CartItem): void {
    this.cartStore.decreaseQuantity(item.product.id);
  }

  onRemove(item: CartItem): void {
    this.cartStore.removeFromCart(item.product.id);
  }

  onClearCart(): void {
    this.cartStore.clearCart();
  }

  onCheckout(): void {
    alert('Thank you for your purchase!');
    this.cartStore.clearCart();
  }
}