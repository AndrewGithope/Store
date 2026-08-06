import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
        MatButtonModule
    ],
    template:`
    <h2 mat-dialog-title>Авторизация</h2>
    <mat-dialog-content>
      <form [formGroup]="loginForm" class="auth-form">
        <mat-form-field appearance="outline">
          <mat-label>Логин</mat-label>
          <input matInput formControlName="username" placeholder="emilys">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Пароль</mat-label>
          <input matInput type="password" formControlName="password" placeholder="emilyspass">
        </mat-form-field>

        <p *ngIf="authStore.error()" class="error-msg">{{ authStore.error() }}</p>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Отмена</button>
      <button mat-raised-button color="primary" [disabled]="loginForm.invalid" (click)="onSubmit()">
        Войти
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .auth-form { display: flex; flex-direction: column; gap: 1rem; pt: 8px; }
    .error-msg { color: #f44336; font-size: 0.85rem; }
  `]
})

export class AuthDialogComponent {
    private fb = inject(FormBuilder);
    readonly authStore = inject(AuthStore);
    private dialogRef = inject(MatDialogRef<AuthDialogComponent>);

    loginForm = this.fb.group({
        username: ['emilys', Validators.required],
        password: ['emilyspass', Validators.required]
    });

    onSubmit(): void {
        if(this.loginForm.valid){
            const {username, password} = this.loginForm.value;
            this.authStore.login({username: username!, password: password!});
            this.dialogRef.close();
        }
    }
}