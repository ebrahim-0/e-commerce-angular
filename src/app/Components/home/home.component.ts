import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { ProductComponent } from '../product/product.component';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { IProduct } from '../../Models/product';
import { EditPopupComponent } from '../edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
    ToastModule,
    CommonModule,
    ToastModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [MessageService],
})
export class HomeComponent implements OnInit {
  products: IProduct[] = [] as IProduct[];

  @ViewChild('paginator') paginator: Paginator | undefined;

  displayAdd: boolean = false;
  displayEdit: boolean = false;
  rows: number = 12;
  totalRecords: number = 0;

  selectedProduct: IProduct = {
    name: '',
    price: '',
    image: '',
    rating: 0,
    id: 0,
  };

  constructor(
    private _ProductService: ProductService,
    private _AuthService: AuthService,
    private _MessageService: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchProducts(0, this.rows);
  }

  fetchProducts(page: number, perPage: number) {
    this._ProductService
      .getAllProducts({
        page,
        perPage,
      })
      .subscribe({
        next: (data) => {
          this.products = data.items;
          this.totalRecords = data.total;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  addProduct(product: any) {
    this._ProductService.addProduct(product).subscribe({
      next: (data) => {
        this.fetchProducts(0, this.rows);
        this.resetPaginator();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editProduct(product: any) {
    this._ProductService.editProduct(product).subscribe({
      next: (data) => {
        this.fetchProducts(0, this.rows);
        this.resetPaginator();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteProduct(id: number) {
    this._ProductService.deleteProduct(id).subscribe({
      next: (data) => {
        this.fetchProducts(0, this.rows);
        this.resetPaginator();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  toggleEditPopup(product: any) {
    if (this._AuthService.isAuthenticated()) {
      if (this._AuthService.isAllowedToChange()) {
        this.selectedProduct = product;
        this.displayEdit = true;
      } else {
        this.Toast({
          severity: 'info',
          summary: 'Info',
          detail: 'You do not have permission to edit products',
        });
      }
    } else {
      this.Toast({
        severity: 'error',
        summary: 'Error',
        detail: 'You Should Login First',
      });
    }
  }

  toggleDeletePopup(product: any) {
    if (this._AuthService.isAuthenticated()) {
      if (this._AuthService.isAllowedToChange()) {
        this.deleteProduct(product.id);
      } else {
        this.Toast({
          severity: 'info',
          summary: 'Info',
          detail: 'You do not have permission to delete products',
        });
      }
    } else {
      this.Toast({
        severity: 'error',
        summary: 'Error',
        detail: 'You Should Login First',
      });
    }
  }

  toggleAddPopup() {
    if (this._AuthService.isAuthenticated()) {
      if (this._AuthService.isAllowedToChange()) {
        this.displayAdd = true;
      } else {
        this.Toast({
          severity: 'info',
          summary: 'Info',
          detail: 'You do not have permission to add products',
        });
      }
    } else {
      this.Toast({
        severity: 'error',
        summary: 'Error',
        detail: 'You Should Login First',
      });
    }
  }
  onConfirmEdit(product: any) {
    if (this._AuthService.isAuthenticated()) {
      if (this._AuthService.isAllowedToChange()) {
        this.editProduct(product);
        this.displayEdit = false;

        this.fetchProducts(0, this.rows);
      } else {
        this.Toast({
          severity: 'info',
          summary: 'Info',
          detail: 'You do not have permission to edit products',
        });
      }
    } else {
      this.Toast({
        severity: 'error',
        summary: 'Error',
        detail: 'You Should Login First',
      });
    }
  }

  onConfirmAdd(product: any) {
    if (this._AuthService.isAuthenticated()) {
      if (this._AuthService.isAllowedToChange()) {
        this.addProduct(product);
        this.displayAdd = false;
      } else {
        this.Toast({
          severity: 'info',
          summary: 'Info',
          detail: 'You do not have permission to add products',
        });
      }
    } else {
      this.Toast({
        severity: 'error',
        summary: 'Error',
        detail: 'You Should Login First',
      });
    }
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  Toast({
    severity,
    summary,
    detail,
  }: {
    severity: string;
    summary: string;
    detail: string;
  }) {
    this._MessageService.add({
      severity,
      summary,
      detail,
    });
  }
}
