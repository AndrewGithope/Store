import { Routes } from '@angular/router';
import { ProductList } from './features/product-list/product-list';
import { ProductDetails } from './features/product-details/product-details';
import { Cart } from './features/cart/cart';

export const routes: Routes = [
    {path: '', component: ProductList},
    {path: 'products/:id', component: ProductDetails},
    {path: 'cart', component: Cart}
];
