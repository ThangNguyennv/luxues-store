import { Editor } from '@tinymce/tinymce-react'
import SelectTree from '~/components/admin/TableTree/SelectTreeProduct'
import { useCreate } from '~/hooks/admin/productCategory/useCreate'
import { API_KEY } from '~/utils/constants'

const CreateProductCategory = () => {
  const {
    allProductCategories,
    productCategoryInfo,
    setProductCategoryInfo,
    uploadImageInputRef,
    preview,
    handleChange,
    handleSubmit,
    handleClick
  } = useCreate()

  return (
    <>
      {productCategoryInfo && (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
          encType="multipart/form-data"
        >
          <h1 className="text-[24px] font-[600] text-[#192335]">Thêm mới danh mục sản phẩm</h1>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input
              onChange={(event) => setProductCategoryInfo({ ...productCategoryInfo, title: event.target.value })}
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
              value={productCategoryInfo.parent_id}
              onChange={(event) => setProductCategoryInfo({ ...productCategoryInfo, parent_id: event.target.value })}
            >
              <option value={''}>-- Chọn danh mục --</option>
              {allProductCategories && allProductCategories.length > 0 && (
                allProductCategories.map(productCategory => (
                  <SelectTree
                    key={productCategory._id}
                    productCategory={productCategory}
                    level={1}
                    allProductCategories={allProductCategories}
                    parent_id={''}
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
              onEditorChange={(newValue) => setProductCategoryInfo({ ...productCategoryInfo, description: newValue })}
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
              className='hidden'
              accept="image/*"
            />
            <button
              onClick={event => handleClick(event)}
              className="bg-[#9D9995] font-[500] border rounded-[5px] w-[6%] py-[4px] text-[14px]"
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
              onChange={(event) => setProductCategoryInfo({ ...productCategoryInfo, position: Number(event.target.value) })}
              type="number"
              id="position"
              name="position"
              placeholder="Tự động tăng"
              className='py-[3px] text-[16px]'
              min={1}
            />
          </div>

          <div className="flex items-center justify-start gap-[10px] text-[16px]">
            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setProductCategoryInfo({ ...productCategoryInfo, status: event.target.value })}
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
                onChange={(event) => setProductCategoryInfo({ ...productCategoryInfo, status: event.target.value })}
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
            className="w-[6%] border rounded-[5px] bg-[#525FE1] text-white p-[5px] text-[14px]"
          >
            Tạo mới
          </button>
        </form>
      )}
    </>
  )
}

export default CreateProductCategory