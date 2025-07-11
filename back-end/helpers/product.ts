export interface OneProduct {
  price: number;
  discountPercentage: number;
  priceNew?: number;
}

// Tính giá mới cho 1 mảng sản phẩm
export const priceNewProducts = (products: OneProduct[]): OneProduct[] => {
  const newProducts: OneProduct[] = products.map((item) => {
    item.priceNew = parseInt(
      ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0)
    );

    return item;
  });
  return newProducts;
};

// Tính giá mới cho 1 sản phẩm
export const priceNewProduct = (product: OneProduct): number => {
  const priceNew = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(0);
  return parseInt(priceNew);
};
