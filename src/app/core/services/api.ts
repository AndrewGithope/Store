import { Injectable, signal, inject, computed, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Product, ProductResponse } from '../../shared/models/product';

@Injectable({
    providedIn: 'root'
})
export class Api {
    apiHTTP = inject(HttpClient);

    apiUrl = 'https://dummyjson.com/products';
    

    getProducts(): Observable<ProductResponse>{
       return this.apiHTTP.get<ProductResponse>(this.apiUrl);
    }

    getProductById(id: string | null): Observable<Product>{
       return this.apiHTTP.get<Product>(`${this.apiUrl}/${id}`);
    }



}
