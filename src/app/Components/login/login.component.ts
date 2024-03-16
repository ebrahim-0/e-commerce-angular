import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent {
  loading: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _MessageService: MessageService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
    ]),
  });

  login(loginForm: FormGroup) {
    loginForm.markAllAsTouched();

    if (loginForm.valid) {
      this.loading = true;
      this._AuthService
        .login({
          email: loginForm.value.email,
          password: loginForm.value.password,
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this._AuthService.currentUser.next(res.user);

            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Logged in Done successfully',
            });

            setTimeout(() => {
              this._Router.navigate(['/']);
              this.loading = false;
            }, 1000);
          },
          error: (err) => {
            console.log(err);

            this._MessageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });

            this.loading = false;
          },
        });
    }
  }
}
