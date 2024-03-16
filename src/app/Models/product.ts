export interface IResponse {
  items: IProduct[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface IProduct {
  id?: number;
  image: string;
  name: string;
  price: string;
  rating: number;
}
