import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/admin/articleCategory/useEdit'
import SelectTree from '~/components/admin/TableTree/SelectTreeArticle'

const EditArticleCategory = () => {
  const {
    allArticleCategories,
    articleCategoryInfo,
    setArticleCategoryInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  } = useEdit()

  return (
    <>
      <h1 className="text-[40px] font-[600] text-[#192335]">Chỉnh sửa danh mục sản phẩm</h1>
      {articleCategoryInfo && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex flex-col gap-[10px]"
          encType="multipart/form-data"
        >
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              onChange={(event) => setArticleCategoryInfo(articleCategoryInfo ? { ...articleCategoryInfo, title: event.target.value } : articleCategoryInfo)}
              type="text"
              id="title"
              name="title"
              value={articleCategoryInfo.title}
            />
          </div>

          <div className="form-group">
            <label htmlFor="parent_id">Danh mục</label>
            <select
              name="parent_id"
              id="parent_id"
              className="outline-none border rounded-[5px] border-[#00171F]"
              value={articleCategoryInfo.parent_id}
              onChange={(event) => setArticleCategoryInfo({ ...articleCategoryInfo, parent_id: event.target.value })}
            >
              <option value={''}>-- Chọn danh mục</option>
              {allArticleCategories && allArticleCategories.length > 0 && (
                allArticleCategories.map(articleCategory => (
                  <SelectTree
                    key={articleCategory._id}
                    articleCategory={articleCategory}
                    level={1}
                    allArticleCategories={allArticleCategories}
                    parent_id={articleCategoryInfo.parent_id}
                  />
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="descriptionShort">Mô tả ngắn</label>
            <Editor
              apiKey={API_KEY}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
              }}
              value={articleCategoryInfo.descriptionShort}
              onEditorChange={(newValue) => setArticleCategoryInfo(articleCategoryInfo ? { ...articleCategoryInfo, descriptionShort: newValue }: articleCategoryInfo)}
              id="descriptionShort"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descriptionDetail">Mô tả chi tiết</label>
            <Editor
              apiKey={API_KEY}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
              }}
              value={articleCategoryInfo.descriptionDetail}
              onEditorChange={(newValue) => setArticleCategoryInfo(articleCategoryInfo ? { ...articleCategoryInfo, descriptionDetail: newValue }: articleCategoryInfo)}
              id="descriptionDetail"
            />
          </div>

          <div className="flex flex-col gap-[5px]">
            <label htmlFor="thumbnail">Ảnh</label>
            <input
              onChange={(event) => handleChange(event)}
              ref={uploadImageInputRef}
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
            />
            <img
              ref={uploadImagePreviewRef}
              src={articleCategoryInfo.thumbnail}
              className="w-[150px] h-auto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Vị trí</label>
            <input
              onChange={(event) => setArticleCategoryInfo(articleCategoryInfo ? { ...articleCategoryInfo, position: Number(event.target.value) }: articleCategoryInfo)}
              type="number"
              id="position"
              name="position"
              placeholder="Tự động tăng"
              min={1}
              value={articleCategoryInfo.position}
            />
          </div>

          <div className="flex items-center justify-start gap-[5px]">
            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setArticleCategoryInfo(articleCategoryInfo ? { ...articleCategoryInfo, status: event.target.value }: articleCategoryInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusActive"
                name="status"
                value={'active'}
                checked={articleCategoryInfo.status === 'active' ? true : false}
              />
              <label htmlFor="statusActive">Hoạt động</label>
            </div>

            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setArticleCategoryInfo(articleCategoryInfo ? { ...articleCategoryInfo, status: event.target.value }: articleCategoryInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusInActive"
                name="status"
                value={'inactive'}
                checked={articleCategoryInfo.status === 'inactive' ? true : false}
              />
              <label htmlFor="statusInActive">Dừng hoạt động</label>
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer w-[10%] border rounded-[5px] bg-[#525FE1] text-white p-[7px]"
          >
            Cập nhật
          </button>
        </form>
      )}
    </>
  )
}

export default EditArticleCategory