import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { cartStore } from '../../../core/store/cart.store';

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './checkout-dialog.component.html',
  styleUrl: './checkout-dialog.component.css'
})
export class CheckoutDialogComponent {
  private fb = inject(FormBuilder);
  readonly cartStore = inject(cartStore);
  private dialogRef = inject(MatDialogRef<CheckoutDialogComponent>);

  isSuccess = false;
  orderNumber = '';

  checkoutForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // Генерируем случайный номер заказа
      this.orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      
      // Очищаем корзину
      this.cartStore.clearCart();
      
      // Показываем экран успешного заказа
      this.isSuccess = true;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}