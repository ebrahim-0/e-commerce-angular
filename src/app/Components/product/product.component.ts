import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { CardModule } from 'primeng/card';
import { TruncateNamePipe } from '../../Pipe/truncate-name.pipe';
import { ButtonModule } from 'primeng/button';
import { IProduct } from '../../Models/product';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    RatingModule,
    FormsModule,
    CardModule,
    TruncateNamePipe,
    ButtonModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements AfterViewInit {
  @Input() product!: IProduct;
  @ViewChild('card') card!: any;
  @Output() edit: EventEmitter<IProduct> = new EventEmitter();
  @Output() delete: EventEmitter<IProduct> = new EventEmitter();

  cardWidth!: number;
  truncateLength!: number;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.cardWidth = this.card.el.nativeElement.offsetWidth;
    this.setTruncateLength();
  }

  ngAfterViewInit() {
    this.cardWidth = this.card.el.nativeElement.offsetWidth;
    setTimeout(() => {
      this.setTruncateLength();
    });
  }

  setTruncateLength() {
    if (this.cardWidth > 330) {
      this.truncateLength = 0;
    } else if (this.cardWidth > 250) {
      this.truncateLength = 18;
    } else if (this.cardWidth > 150) {
      this.truncateLength = 12;
    } else {
      this.truncateLength = 8;
    }
  }

  editProduct() {
    this.edit.emit(this.product);
  }
  deleteProduct() {
    this.delete.emit(this.product);
  }
}
