import { convertToFullName, convertToSlug } from "./convertToSlug";

interface ObjectSearch {
  slug?: RegExp,
  keyword: string,
  regex?: RegExp,
  fullName?: RegExp
}

const searchHelpers = (query: Record<string, unknown>): ObjectSearch => {
  const objectSearch: ObjectSearch = {
    keyword: ''
  }

  if (query.keyword) {
    if (typeof query.keyword === 'string') {  
      objectSearch.keyword = query.keyword
      const stringSlug = convertToSlug(String(query.keyword))
      const stringSlugRegex = new RegExp(stringSlug, 'i')
      const regex = new RegExp(objectSearch.keyword, 'i') // Lưu ý: không sử dụng global(g) do sẽ có sự luân phiên true/false khi hàm test chạy.

      objectSearch.regex = regex // Tự tạo thêm biến title vào đối tượng find
      objectSearch.slug = stringSlugRegex
    }
  }

  return objectSearch
}

export default searchHelpers
