export interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  description?: string;
  stock?: number;
  status?: string;
}

