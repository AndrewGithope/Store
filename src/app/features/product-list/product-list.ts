import { Component, inject, OnInit } from '@angular/core';
import { Api } from '../../core/services/api';
import { Product, ProductResponse } from '../../shared/models/product';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart-service';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/services/ai-service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit{
  service = inject(Api);
  aiService = inject(AiService);

  private cartService = inject(CartService);

  onAddToCart(product: any, event: Event): void{
    event.stopPropagation();
    this.cartService.addToCart(product);
    console.log('Items in cart:', this.cartService.cartItems());
  }

  products: Product[] = [];

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  searchQuery: string = '';
  selectedCategory: string = 'all';

  categories: string[] = ['all', 'beauty', 'fragrances', 'groceries'];

  ngOnInit(): void {
  this.service.getProducts().subscribe((data: any) => {
    this.allProducts = data.products || data;
    this.filteredProducts = this.allProducts;

    this.aiService.initializeAsisstantWithProducts(this.allProducts);
  })
  }

  applyFilters(): void {
    this.filteredProducts = this.allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.category.toLowerCase() === this.selectedCategory.toLowerCase();

      return matchesCategory && matchesSearch;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

}
