import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { cartStore } from '../../core/store/cart.store';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  readonly cartStore = inject(cartStore);

  product = signal<any>(null);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    

    fetch(`https://dummyjson.com/products/${productId}`)
      .then(res => res.json())
      .then(data => this.product.set(data))
      .catch(err => console.error('Failed to load product details', err));
  }

  addToCart(): void {
    if (this.product()) {
      this.cartStore.addToCart(this.product());
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}