export interface IDiscounts {
  _id: string;
  code:string
  productID: string;
  variantID: string;
  discount_type: string;
  discount_value: string;
  status: string;
  date:Date[]
}