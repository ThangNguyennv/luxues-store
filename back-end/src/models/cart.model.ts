import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        product_id: String,
        quantity: Number,
        color: { type: String, required: true }, // Ví dụ: "Xanh Navy"
        size: { type: String, required: true }, // Ví dụ: ["S", "M", "L", "XL"]
      }
    ]
  },
  {
    timestamps: true
  }
)

const Cart = mongoose.model('Cart', cartSchema, 'carts')

export default Cart
