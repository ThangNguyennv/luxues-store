export interface ProductDetailInterface {
  _id: string;
  title: string;
  price: number;
  discountPercentage: number,
  thumbnail: string,
  stock: number,
  position: number,
  accountFullName: string
  status: string
  description: string
  featured: string
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
  products: ProductDetailInterface[];
  filterStatus: FilterStatusInterface[];
  pagination: PaginationInterface;
  currentKeyword: string,
  currentSortKey: string,
  currentSortValue: string
}

export interface LoginResponseInterface {
  code: number;
  email: string,
  password: string,
  token: string
}

export interface LogoutResponseInterface {
  error: Error,
  code: number;
}

interface StatisticGroup {
  total: number;
  active: number;
  inactive: number;
}

interface Statistic {
  categoryProduct: StatisticGroup;
  product: StatisticGroup;
  account: StatisticGroup;
  user: StatisticGroup;
}

export interface DashboardInterface {
  statistic: Statistic
}

export interface RoleInterface {
  title: string;
}

export interface AccountInfoInterface {
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  token: string
};

export interface AccountInterface {
  account: AccountInfoInterface
  role: RoleInterface;
}

export interface ProductInterface {
  product: ProductDetailInterface
}
