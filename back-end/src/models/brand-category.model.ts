import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const brandCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    parent_id: {
      type: String,
      default: ''
    },
    description: String,
    thumbnail: String,
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
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
      account_id: String
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
    ]
  },
  {
    timestamps: true
  }
)

const BrandCategory = mongoose.model('BrandCategory', brandCategorySchema, 'brands-category')

export default BrandCategory
