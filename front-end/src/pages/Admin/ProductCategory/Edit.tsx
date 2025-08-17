import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/admin/productCategory/useEdit'
import SelectTree from '~/components/admin/TableTree/SelectTreeProduct'

const EditProductCategory = () => {
  const {
    allProductCategories,
    productCategoryInfo,
    setProductCategoryInfo,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  } = useEdit()

  return (
    <>
      <h1 className="text-[40px] font-[600] text-[#192335]">Chỉnh sửa danh mục sản phẩm</h1>
      {productCategoryInfo && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex flex-col gap-[10px]"
          encType="multipart/form-data"
        >
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              onChange={(event) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, title: event.target.value } : productCategoryInfo)}
              type="text"
              id="title"
              name="title"
              value={productCategoryInfo.title}
            />
          </div>

          <div className="form-group">
            <label htmlFor="parent_id">Danh mục</label>
            <select
              name="parent_id"
              id="parent_id"
              className="outline-none border rounded-[5px] border-[#00171F]"
              value={productCategoryInfo.parent_id}
              onChange={(event) => setProductCategoryInfo({ ...productCategoryInfo, parent_id: event.target.value })}
            >
              <option value={''}>-- Chọn danh mục</option>
              {allProductCategories && allProductCategories.length > 0 && (
                allProductCategories.map(productCategory => (
                  <SelectTree
                    key={productCategory._id}
                    productCategory={productCategory}
                    level={1}
                    allProductCategories={allProductCategories}
                    parent_id={productCategoryInfo.parent_id}
                  />
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="desc">Mô tả</label>
            <Editor
              apiKey={API_KEY}
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
              }}
              value={productCategoryInfo.description}
              onEditorChange={(newValue) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, description: newValue }: productCategoryInfo)}
              id="desc"
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
              src={productCategoryInfo.thumbnail}
              className="w-[150px] h-auto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Vị trí</label>
            <input
              onChange={(event) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, position: Number(event.target.value) }: productCategoryInfo)}
              type="number"
              id="position"
              name="position"
              placeholder="Tự động tăng"
              min={1}
              value={productCategoryInfo.position}
            />
          </div>

          <div className="flex items-center justify-start gap-[5px]">
            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, status: event.target.value }: productCategoryInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusActive"
                name="status"
                value={'active'}
                checked={productCategoryInfo.status === 'active' ? true : false}
              />
              <label htmlFor="statusActive">Hoạt động</label>
            </div>

            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setProductCategoryInfo(productCategoryInfo ? { ...productCategoryInfo, status: event.target.value }: productCategoryInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusInActive"
                name="status"
                value={'inactive'}
                checked={productCategoryInfo.status === 'inactive' ? true : false}
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

export default EditProductCategory