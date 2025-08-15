import type { CurrentParamsInterface, GeneralInfoInterface, HelperInterface, ParamsInterface } from './helper.type'

export interface ArticleCategoryInfoInterface extends GeneralInfoInterface {
  children: ArticleCategoryInfoInterface[] | [],
  parent_id: string,
  descriptionShort: string,
  descriptionDetail: string
}

export interface ArticleCategoryAllResponseInterface extends HelperInterface, CurrentParamsInterface {
  articleCategories: ArticleCategoryInfoInterface[],
  allArticleCategories: ArticleCategoryInfoInterface[]
}

export interface ArticleCategoryStates extends HelperInterface, ParamsInterface {
  articleCategories: ArticleCategoryInfoInterface[],
  allArticleCategories: ArticleCategoryInfoInterface[],
}

export type ArticleCategoryActions =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: Partial<ArticleCategoryStates> }
  | { type: 'RESET' }

export interface ArticleCategoryDetailInterface {
  articleCategory: ArticleCategoryInfoInterface
}