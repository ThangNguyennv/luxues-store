import { Editor } from '@tinymce/tinymce-react'
import SelectTree from '~/components/Admin/TableTree/SelectTreeArticle'
import { useCreate } from '~/hooks/Admin/articleCategory/useCreate'
import { API_KEY } from '~/utils/constants'

const CreateArticleCategory = () => {
  const {
    allArticleCategories,
    articleCategoryInfo,
    setArticleCategoryInfo,
    uploadImageInputRef,
    handleChange,
    handleSubmit,
    preview,
    handleClick,
    role
  } = useCreate()

  return (
    <>
      {role && role.permissions.includes('articles-category_create') && (
        articleCategoryInfo && (
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
            encType="multipart/form-data"
          >
            <h1 className="text-[24px] font-[600] text-[#192335]">Thêm mới danh mục bài viết</h1>
            <div className="form-group">
              <label htmlFor="title">Tiêu đề</label>
              <input
                onChange={(event) => setArticleCategoryInfo({ ...articleCategoryInfo, title: event.target.value })}
                type="text"
                id="title"
                name="title"
                className='py-[3px] text-[16px]'
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="parent_id">Danh mục cha</label>
              <select
                name="parent_id"
                id="parent_id"
                className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
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
                      parent_id={''}
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
                onEditorChange={(newValue) => setArticleCategoryInfo({ ...articleCategoryInfo, descriptionShort: newValue })}
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
                onEditorChange={(newValue) => setArticleCategoryInfo({ ...articleCategoryInfo, descriptionDetail: newValue })}
                id="descriptionDetail"
              />
            </div>

            <div className="flex flex-col gap-[10px]">
              <label htmlFor="thumbnail">Ảnh</label>
              <input
                onChange={(event) => handleChange(event)}
                ref={uploadImageInputRef}
                type="file"
                id="thumbnail"
                name="thumbnail"
                className='hidden'
                accept="image/*"
              />
              <button
                onClick={event => handleClick(event)}
                className="bg-[#9D9995] font-[500] border rounded-[5px] w-[5%] py-[4px] text-[14px]"
              >
              Chọn ảnh
              </button>
              {preview && (
                <img
                  src={preview}
                  alt="Thumbnail preview"
                  className="border rounded-[5px] w-[150px] h-[150px]"
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="position">Vị trí</label>
              <input
                onChange={(event) => setArticleCategoryInfo({ ...articleCategoryInfo, position: Number(event.target.value) })}
                type="number"
                id="position"
                name="position"
                placeholder="Tự động tăng"
                className='py-[3px] text-[16px]'
                min={1}
              />
            </div>

            <div className="flex items-center justify-start gap-[10px]">
              <div className="flex gap-[5px]">
                <input
                  onChange={(event) => setArticleCategoryInfo({ ...articleCategoryInfo, status: event.target.value })}
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
                  onChange={(event) => setArticleCategoryInfo({ ...articleCategoryInfo, status: event.target.value })}
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
              className="w-[5%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
            >
              Tạo mới
            </button>
          </form>
        )
      )}
    </>
  )
}

export default CreateArticleCategory