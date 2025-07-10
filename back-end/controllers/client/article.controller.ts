const Article = require("../../models/article.model");
const ArticleCategory = require("../../models/article-category.model");

// [GET] /articles
module.exports.index = async (req, res) => {
  const articles = await Article.find({
    deleted: false,
  }).sort({ position: "desc" });

  res.render("client/pages/articles/index.pug", {
    pageTitle: "Danh sách bài viết",
    articles: articles,
  });
};

// [GET] /articles/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ArticleCategory.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    const getSubArticle = async (parentId) => {
      const subs = await ArticleCategory.find({
        deleted: false,
        status: "active",
        parent_id: parentId,
      });
      let allSub = [...subs]; // Cú pháp trải ra (spread syntax)

      for (const sub of subs) {
        const childs = await getSubArticle(sub.id); // Gọi đệ quy để lấy tất cả các danh mục con
        allSub = allSub.concat(childs); // Nối mảng con vào mảng cha
      }
      return allSub;
    };

    const listSubCategory = await getSubArticle(category.id);

    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const articles = await Article.find({
      deleted: false,
      article_category_id: { $in: [category.id, ...listSubCategoryId] },
    }).sort({ position: "desc" });
    console.log(articles);
    res.render("client/pages/articles/index.pug", {
      pageTitle: category.title,
      articles: articles,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại danh mục bài viết này!`);
    res.redirect(`/articles`);
  }
};

// [GET] /articles/:slugArticle
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugArticle,
      status: "active",
    };

    const article = await Article.findOne(find);

    if (article.article_category_id) {
      const category = await ArticleCategory.findOne({
        _id: article.article_category_id,
        deleted: false,
        status: "active",
      });
      article.category = category;
    }
    res.render("client/pages/articles/detail.pug", {
      pageTitle: article.title,
      article: article,
    });
  } catch (error) {
    // Có thể không xảy ra / Ít xảy ra
    req.flash("error", `Không tồn tại bài viết này!`);
    res.redirect(`/articles`);
  }
};
