import mongoose from 'mongoose'
import slug from 'mongoose-slug-updater'

mongoose.plugin(slug)

const articleSchema = new mongoose.Schema(
  {
    title: String, // San pham 1
    article_category_id: {
      type: String,
      default: ''
    },
    descriptionShort: String,
    descriptionDetail: String,
    thumbnail: String,
    status: String,
    featured: String,
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

const Article = mongoose.model('Article', articleSchema, 'articles')

export default Article
