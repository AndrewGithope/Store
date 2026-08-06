import { Injectable, signal, inject, computed, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product, ProductsResponse } from '../../shared/models/product';

@Injectable({
    providedIn: 'root'
})
export class Api {
    apiHTTP = inject(HttpClient);

    apiUrl = 'https://dummyjson.com';
    

    getFragrances(): Observable<ProductsResponse>{
       return this.apiHTTP.get<ProductsResponse>(`${this.apiUrl}/products/category/fragrances`);
    }

    getProductById(id: string | null): Observable<Product>{
       return this.apiHTTP.get<Product>(`${this.apiUrl}/products/${id}`);
    }



}
