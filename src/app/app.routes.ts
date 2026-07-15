import { Routes } from '@angular/router';
import { ProductList } from './features/product-list/product-list';
import { ProductDetails } from './features/product-details/product-details';

export const routes: Routes = [
    {path: '', component: ProductList, pathMatch: 'full'},
    {path: 'products/:id', component: ProductDetails}
];
