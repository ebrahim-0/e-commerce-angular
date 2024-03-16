import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IProduct } from '../../Models/product';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    FloatLabelModule,
    InputTextModule,
    InputNumberModule,
    RatingModule,
    MessageModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss',
  providers: [MessageService],
})
export class EditPopupComponent implements OnChanges {
  @Input() display: boolean = false;
  @Input() header!: string;
  @Input() message!: string;

  @Output() displayChange = new EventEmitter<boolean>();

  @Output() confirm = new EventEmitter<IProduct>();
  @Output() cancel = new EventEmitter<void>();

  @Input() product: IProduct = {
    name: '',
    price: '',
    image: '',
    rating: 0,
  };

  constructor(
    private _MessageService: MessageService,
    private _FormBuilder: FormBuilder
  ) {}

  productForm = this._FormBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: ['', [Validators.required]],
    image: ['', [Validators.required]],
    rating: [0, [Validators.required]],
  });

  ngOnChanges() {
    this.productForm.patchValue(this.product);
  }

  onConfirm() {
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      const { name, image, price, rating } = this.productForm.value;
      this.confirm.emit({
        id: this.product.id,
        name: name || '',
        image: image || '',
        price: price || '',
        rating: rating || 0,
      });

      this.display = false;
      this.displayChange.emit(this.display);

      this._MessageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.message,
      });

      this.product = {
        name: '',
        price: '',
        image: '',
        rating: 0,
      };
    } else {
      this._MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Form is not valid!',
      });
    }
  }

  onCancel() {
    this.display = false;
    this.displayChange.emit(this.display);

    this._MessageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Canceled',
    });
  }
}
