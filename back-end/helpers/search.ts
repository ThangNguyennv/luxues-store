interface ObjectSearch {
  keyword: string;
  regex?: RegExp;
}

const searchHelpers = (query: Record<string, any>): ObjectSearch => {
  let objectSearch: ObjectSearch = {
    keyword: "",
  };

  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i"); // Lưu ý: không sử dụng global(g) do sẽ có sự luân phiên true/false khi hàm test chạy.
    objectSearch.regex = regex; // Tự tạo thêm biến title vào đối tượng find
  }

  return objectSearch;
};
export default searchHelpers;
