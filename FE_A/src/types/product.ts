export interface IProducts {
  _id?: string
  name: string
  description?: string
  price: number
  stock: number
  category: string
  imageUrl: string
  images?: string[]
  status: string
  discountPercent?: number
  rating?: number
  reviews?: Array<{
    userId?: string
    userName: string
    userAvatar?: string
    rating: number
    comment: string
    createdAt?: string
  }>
  publisher?: string
  releaseDate?: string
  language?: string
  pages?: number
  age?: string
  dimensions?: string
}