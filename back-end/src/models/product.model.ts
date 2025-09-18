import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    product_category_id: {
      type: String,
      default: ''
    },
    description: String,
    price: {
      type: Number, 
      default: 0
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0
    },
    thumbnail: String,
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    featured: {
      type: String,
      default: '1'
    },
    slug: {
      type: String,
      slug: 'title', 
      unique: true 
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      account_id: String,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date
      }
    ],
    recoveredAt: Date
  },
  {
    timestamps: true
  }
)

const Product = mongoose.model('Product', productSchema, 'products')

export default Product
