import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../core/services/api';
import { Product } from '../../shared/models/product';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit{
  private route = inject(ActivatedRoute);
  private apiService = inject(Api);

  product: Product | null = null;

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    this.apiService.getProductById(productId).subscribe(data => {
      this.product = data;
      console.log('More information about item', this.product);
    })
  }
}
