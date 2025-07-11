import mongoose from "mongoose";

// Giúp tạo dấu gạch ngang như url -> bot của google phát hiện -> SEO tốt hơn
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);

// Sử dụng mongoose, buộc phải tuần theo Schema này, nếu chẳng may có người thêm các thuộc tính linh tinh khác vào thì nó sẽ không lưu vào database.
const articleCategorySchema = new mongoose.Schema(
  {
    title: String, // San pham 1
    parent_id: {
      type: String,
      default: "",
    },
    descriptionShort: String,
    descriptionDetail: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", // <-> San-pham-1
      unique: true, // slug duy nhất
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
    recoveredAt: Date,
  },
  //timestamps là một cách tiện lợi để tự động thêm và quản lý hai trường thời gian tiêu chuẩn trong mỗi document: createdAt – thời điểm document được tạo, updatedAt – thời điểm document được cập nhật lần cuối
  {
    timestamps: true,
  }
);

// Tham số thứ ba là tên collection trong database
const ArticleCategory = mongoose.model(
  "ArticleCategory",
  articleCategorySchema,
  "articles-category"
);

export default ArticleCategory;
