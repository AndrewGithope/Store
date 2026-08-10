import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // <-- Add this import

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule // <-- Add MatIconModule here
  ],
  templateUrl: './footer.html', // or footer.html
  styleUrl: './footer.css'
})
export class Footer {}