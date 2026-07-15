import { Component, inject, OnInit } from '@angular/core';
import { Api } from '../../core/services/api';
import { Product, ProductResponse } from '../../shared/models/product';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit{
  service = inject(Api);

  products: Product[] = [];

  ngOnInit(): void {
    this.service.getProducts().subscribe(response => {
      console.log('Data is gone', response)
      this.products = response.products;
    })
  }



}
