export interface IProducto {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface ICartItem extends IProducto {
  cantidad: number;
}
