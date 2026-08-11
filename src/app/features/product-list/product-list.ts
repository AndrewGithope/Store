import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../shared/models/product';
import { Api } from '../../core/services/api';
import { cartStore } from '../../core/store/cart.store';
import { Header } from '../../shared/components/header/header';
import { AuthStore } from '../../core/store/auth.store';
import { AuthDialogComponent } from '../../shared/components/auth-dialog/auth-dialog.component';
import { AiService } from '../../core/services/ai-service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  private productService = inject(Api);
  readonly cartStore = inject(cartStore);
  readonly authStore = inject(AuthStore);
  private dialog = inject(MatDialog);
  private aiService = inject(AiService);

  products = signal<Product[]>([]);
  searchQuery = signal<string>('');

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    return this.products().filter((product) =>
      product.title.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.productService.getFragrances().subscribe((data) => {
      const items: Product[] = Array.isArray(data) ? data : ((data as any)?.products ?? []);
      this.products.set(items);
      this.aiService.initializeAsisstantWithProducts(items);
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  scrollToCatalog(): void {
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  addToCart(product: Product): void {
    if (!this.authStore.isAuthenticated()) {
      this.dialog.open(AuthDialogComponent, {
        width: '400px'
      });
      return;
    }

    this.cartStore.addToCart(product);
  }
}