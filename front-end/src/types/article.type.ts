import type { CurrentParamsInterface, GeneralInfoInterface, HelperInterface, ParamsInterface } from './helper.type'

export interface ArticleInfoInterface extends GeneralInfoInterface {
  article_category_id: string,
  featured: string,
  descriptionShort: string,
  descriptionDetail: string,
  accountFullName: string,
}

export interface ArticleAllResponseInterface extends HelperInterface, CurrentParamsInterface {
  articles: ArticleInfoInterface[],
}

export interface ArticleStates extends HelperInterface, ParamsInterface {
  articles: ArticleInfoInterface[],
}

export type ArticleActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ArticleStates> }
  | { type: 'RESET' }

export interface ArticleDetailInterface {
  article: ArticleInfoInterface
}

export interface ArticlesWithCategoryDetailInterface {
  articles: ArticleInfoInterface[],
  pageTitle: string
}