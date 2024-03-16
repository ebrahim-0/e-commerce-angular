import { Component, Inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ToastModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [MessageService],
})
export class NavbarComponent implements OnInit {
  constructor(
    private _AuthService: AuthService,
    @Inject(MessageService) private _MessageService: MessageService
  ) {}

  currentUser!: any;

  ngOnInit(): void {
    this._AuthService.currentUser.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.log(err);

        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while getting current user',
        });
      },
    });
  }

  logout() {
    this._AuthService.logout();

    console.log('Logged out Done successfully');

    this._MessageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged out Done successfully',
    });
  }
}
