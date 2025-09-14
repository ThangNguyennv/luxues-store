import type { ProductInfoInterface } from './product.type'

export interface SearchInterface {
    products: ProductInfoInterface[],
    keyword: string,
}