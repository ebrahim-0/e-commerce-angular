import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponse } from '../Models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private _HttpClient: HttpClient,
    @Inject('ECOMMERCE_API_URL') private ECOMMERCE_API_URL: string
  ) {}

  getAllProducts(params: {
    page: number;
    perPage: number;
  }): Observable<IResponse> {
    return this._HttpClient.get<IResponse>(
      `${this.ECOMMERCE_API_URL}/products`,
      {
        params,
      }
    );
  }

  addProduct(product: any): Observable<any> {
    return this._HttpClient.post(`${this.ECOMMERCE_API_URL}/products`, product);
  }

  editProduct(product: any): Observable<any> {
    return this._HttpClient.put(
      `${this.ECOMMERCE_API_URL}/products/${product.id}`,
      product
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this._HttpClient.delete(`${this.ECOMMERCE_API_URL}/products/${id}`);
  }
}
