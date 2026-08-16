import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { cartStore } from '../../core/store/cart.store';
import { AuthStore } from '../../core/store/auth.store';
import { AuthDialogComponent } from '../../shared/components/auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  readonly cartStore = inject(cartStore);
  readonly authStore = inject(AuthStore);

  product = signal<any>(null);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      fetch(`https://dummyjson.com/products/${productId}`)
        .then(res => res.json())
        .then(data => this.product.set(data))
        .catch(err => console.error('Failed to load product details', err));
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  addToCart(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    const currentProduct = this.product();
    if (!currentProduct) return;

    
    const isAuthenticated = this.authStore.isAuthenticated();

    if (!isAuthenticated) {
      
      const dialogRef = this.dialog.open(AuthDialogComponent, {
        width: '400px'
      });

      dialogRef.afterClosed().subscribe(() => {
        if (this.authStore.isAuthenticated()) {
          this.executeAddToCart(currentProduct);
        }
      });

      return;
    }

    this.executeAddToCart(currentProduct);
  }

  private executeAddToCart(productData: any): void {
    const itemToCart = {
      ...productData,
      quantity: 1
    };

    this.cartStore.addToCart(itemToCart);
  }
}