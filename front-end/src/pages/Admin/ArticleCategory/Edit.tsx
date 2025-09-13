import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/admin/articleCategory/useEdit'
import SelectTree from '~/components/admin/TableTree/SelectTreeArticle'
import Skeleton from '@mui/material/Skeleton'

const EditArticleCategory = () => {
  const {
    allArticleCategories,
    articleCategoryInfo,
    setArticleCategoryInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit,
    handleClick,
    role
  } = useEdit()

  return (
    <>
      {role && role.permissions.includes('articles-category_edit') && (
        articleCategoryInfo ? (
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
            encType="multipart/form-data"
          >
            <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa danh mục bài viết</h1>
            <div className="form-group">
              <label htmlFor="title">Tiêu đề</label>
              <input
                onChange={(event) => setArticleCategoryInfo(articleCategoryInfo ? { ...articleCategoryInfo, title: event.target.value } : articleCategoryInfo)}
                type="text"
                id="title"
                name="title"
                className='py-[3px] text-[16px]'
                value={articleCategoryInfo.title}
              />
            </div>

            <div className="form-group">
              <label htmlFor="parent_id">Danh mục</label>
              <select
                name="parent_id"
                id="parent_id"
                className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
                value={articleCategoryInfo.parent_id}
                onChange={(event) => setArticleCategoryInfo({ ...articleCategoryInfo, parent_id: event.target.value })}
              >
                <option value={''}>-- Chọn danh mục --</option>
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
                className='hidden'
                accept="image/*"
              />
              <button
                onClick={event => handleClick(event)}
                className="bg-[#9D9995] font-[500] border rounded-[5px] w-[5%] py-[4px] text-[14px]"
              >
                Chọn ảnh
              </button>
              <img
                ref={uploadImagePreviewRef}
                src={articleCategoryInfo.thumbnail}
                alt="Thumbnail preview"
                className="border rounded-[5px] w-[150px] h-[150px]"
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
                className='py-[3px] text-[16px]'
                value={articleCategoryInfo.position}
              />
            </div>

            <div className="flex items-center justify-start gap-[10px]">
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
              className="w-[5%] border rounded-[5px] bg-[#525FE1] text-white p-[7px] text-[14px]"
            >
              Cập nhật
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md">
            <Skeleton variant="text" width={385} height={48} sx={{ bgcolor: 'grey.400' }}/>
            <div className="form-group">
              <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={1000} height={36} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={1000} height={36} sx={{ bgcolor: 'grey.400' }}/>
            </div>

            <div className="form-group">
              <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={1000} height={500} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className="form-group">
              <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={1000} height={500} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className="flex flex-col gap-[5px]">
              <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={100} height={36} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={100} height={36} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className="form-group">
              <Skeleton variant="text" width={40} height={32} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={1000} height={36} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <div className="flex items-center justify-start gap-[10px]">
              <Skeleton variant="rectangular" width={40} height={36} sx={{ bgcolor: 'grey.400' }}/>
              <Skeleton variant="rectangular" width={140} height={36} sx={{ bgcolor: 'grey.400' }}/>
            </div>
            <Skeleton variant="rectangular" width={91} height={37} sx={{ bgcolor: 'grey.400' }}/>
          </div>
        )
      )}
    </>
  )
}

export default EditArticleCategory