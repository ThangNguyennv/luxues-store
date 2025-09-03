import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/admin/article/useEdit'
import SelectTree from '~/components/admin/TableTree/SelectTreeArticle'
import Skeleton from '@mui/material/Skeleton'

const EditArticle = () => {
  const {
    allArticleCategories,
    articleInfo,
    setArticleInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit,
    handleClick
  } = useEdit()

  return (
    <>
      {articleInfo ? (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
          encType="multipart/form-data"
        >
          <h1 className="text-[24px] font-[600] text-[#192335]">Chỉnh sửa bài viết</h1>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              onChange={(event) => setArticleInfo(articleInfo ? { ...articleInfo, title: event.target.value } : articleInfo)}
              type="text"
              id="title"
              name="title"
              className='py-[3px] text-[16px]'
              value={articleInfo.title}
            />
          </div>

          <div className="form-group">
            <label htmlFor="article_category_id">Danh mục</label>
            <select
              name="article_category_id"
              id="article_category_id"
              className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
              value={articleInfo.article_category_id}
              onChange={(event) => setArticleInfo({ ...articleInfo, article_category_id: event.target.value })}
            >
              <option value={''}>-- Chọn danh mục</option>
              {allArticleCategories && allArticleCategories.length > 0 && (
                allArticleCategories.map(articleCategory => (
                  <SelectTree
                    key={articleCategory._id}
                    articleCategory={articleCategory}
                    level={1}
                    allArticleCategories={allArticleCategories}
                    parent_id={articleInfo.article_category_id}
                  />
                ))
              )}
            </select>
          </div>

          <div className="flex items-center justify-start gap-[10px]">
            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setArticleInfo(articleInfo ? { ...articleInfo, featured: event.target.value }: articleInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="featured1"
                name="featured"
                value={'1'}
                checked={articleInfo.featured === '1' ? true : false}
              />
              <label htmlFor="featured1">Nổi bật</label>
            </div>
            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setArticleInfo(articleInfo ? { ...articleInfo, featured: event.target.value }: articleInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="featured0"
                name="featured"
                value={'0'}
                checked={articleInfo.featured === '0' ? true : false}
              />
              <label htmlFor="featured0">Không nổi bật</label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descriptionShort">Mô tả ngắn</label>
            <Editor
              apiKey={API_KEY}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
              }}
              value={articleInfo.descriptionShort}
              onEditorChange={(newValue) => setArticleInfo(articleInfo ? { ...articleInfo, descriptionShort: newValue }: articleInfo)}
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
              value={articleInfo.descriptionDetail}
              onEditorChange={(newValue) => setArticleInfo(articleInfo ? { ...articleInfo, descriptionDetail: newValue }: articleInfo)}
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
              src={articleInfo.thumbnail}
              alt="Thumbnail preview"
              className="border rounded-[5px] w-[150px] h-[150px]"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Vị trí</label>
            <input
              onChange={(event) => setArticleInfo(articleInfo ? { ...articleInfo, position: Number(event.target.value) }: articleInfo)}
              type="number"
              id="position"
              name="position"
              placeholder="Tự động tăng"
              min={1}
              value={articleInfo.position}
            />
          </div>

          <div className="flex items-center justify-start gap-[5px]">
            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setArticleInfo(articleInfo ? { ...articleInfo, status: event.target.value }: articleInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusActive"
                name="status"
                value={'active'}
                checked={articleInfo.status === 'active' ? true : false}
              />
              <label htmlFor="statusActive">Hoạt động</label>
            </div>

            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setArticleInfo(articleInfo ? { ...articleInfo, status: event.target.value }: articleInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusInActive"
                name="status"
                value={'inactive'}
                checked={articleInfo.status === 'inactive' ? true : false}
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
          <Skeleton variant="text" width={470} height={30} sx={{ bgcolor: 'grey.400' }}/>
          <div className="form-group">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
          </div>
          <div className="form-group">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
          </div>

          <div className="flex items-center justify-start gap-[10px]">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
          </div>

          <div className="form-group">
            <Skeleton variant="rectangular" width={100} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={1000} height={400} sx={{ bgcolor: 'grey.400' }}/>
          </div>

          <div className="form-group">
            <Skeleton variant="rectangular" width={100} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={1000} height={400} sx={{ bgcolor: 'grey.400' }}/>
          </div>

          <div className="flex flex-col gap-[5px]">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={150} height={150} sx={{ bgcolor: 'grey.400' }}/>
          </div>

          <div className="form-group">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="rectangular" width={452} height={32} sx={{ bgcolor: 'grey.400' }}/>
          </div>

          <div className="flex items-center justify-start gap-[5px]">
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
            <Skeleton variant="text" width={100} height={30} sx={{ bgcolor: 'grey.400' }}/>
          </div>

          <Skeleton variant="rectangular" width={100} height={50} sx={{ bgcolor: 'grey.400' }}/>
        </div>
      )}
    </>
  )
}

export default EditArticle