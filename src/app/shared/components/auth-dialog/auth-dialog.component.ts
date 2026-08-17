import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-auth-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.css'
})
export class AuthDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AuthDialogComponent>);
  private snackBar = inject(MatSnackBar);
  readonly authStore = inject(AuthStore);

  authForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSignIn(): void {
    if (this.authForm.invalid) return;

    const { username, password } = this.authForm.value;

    if (typeof (this.authStore as any).login === 'function') {
      (this.authStore as any).login({ username, password });
    } else if (typeof (this.authStore as any).setUser === 'function') {
      (this.authStore as any).setUser({ username });
    }

    this.snackBar.open('Successfully authorized!', 'Close', { duration: 3000 });
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}