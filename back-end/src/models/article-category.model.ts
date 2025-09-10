import mongoose from 'mongoose'

import slug from 'mongoose-slug-updater'
mongoose.plugin(slug)

const articleCategorySchema = new mongoose.Schema(
  {
    title: String, // San pham 1
    parent_id: {
      type: String,
      default: ''
    },
    descriptionShort: String,
    descriptionDetail: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: 'title', // <-> San-pham-1
      unique: true // slug duy nhất
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
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

const ArticleCategory = mongoose.model(
  'ArticleCategory',
  articleCategorySchema,
  'articles-category'
)

export default ArticleCategory
