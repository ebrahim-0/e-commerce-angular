import { Component } from '@angular/core';
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
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export class RegisterComponent {
  loading: boolean = false;

  registerForm = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
      ]),
      confirm_password: new FormControl(null, [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
      ]),
    },
    { validators: this.matchPassword }
  );

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _MessageService: MessageService
  ) {}

  matchPassword(registerForm: any) {
    if (
      registerForm.get('password')?.value !==
      registerForm.get('confirm_password')?.value
    ) {
      const match = { notMatch: 'Passwords do not match' };

      registerForm.get('confirm_password')?.setErrors(match);
      return match;
    } else {
      return null;
    }
  }

  register(registerForm: FormGroup) {
    registerForm.markAllAsTouched();

    if (registerForm.valid) {
      this.loading = true;

      this._AuthService.register(registerForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          this._AuthService.currentUser.next(res.user);

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Registration Done successfully',
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
            detail: err.error,
          });

          this.loading = false;
        },
      });
    }
  }
}
