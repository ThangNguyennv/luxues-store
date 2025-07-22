export interface ProductInterface {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number,
  thumbnail: string,
  stock: number,
  position: number,
  accountFullName: string
}

export interface FilterStatusInterface {
  name: string,
  status: string,
  class?: string
}

export interface PaginationInterface {
  currentPage: number,
  limitItems: number,
  skip: number,
  totalPage: number
}

export interface ProductAllResponseInterface {
  products: ProductInterface[];
  filterStatus: FilterStatusInterface[];
  pagination: PaginationInterface;
  currentKeyword: string
}
