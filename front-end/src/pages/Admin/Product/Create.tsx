import { Editor } from '@tinymce/tinymce-react'
import SelectTreeProduct from '~/components/Admin/TableTree/SelectTreeProduct'
import { useCreate } from '~/hooks/Admin/product/useCreate'
import { API_KEY } from '~/utils/constants'

const CreateProduct = () => {
  const {
    allProductCategories,
    productInfo,
    setProductInfo,
    uploadImageInputRef,
    handleSubmit,
    role,
    currentColor,
    setCurrentColor,
    currentSize,
    setCurrentSize,
    handleAddColor,
    handleRemoveColor,
    handleAddSize,
    handleRemoveSize,
    thumbnailPreview,
    handleThumbnailChange,
    handleAddImagesToColor,
    handleRemoveImageFromColor,
    colorFileInputRefs,
    handleClick
  } = useCreate()

  return (
    <>
      {role && role.permissions.includes('products_create') && (
        productInfo && (
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="flex flex-col gap-[15px] text-[17px] font-[500] bg-[#FFFFFF] p-[15px] shadow-md"
            encType="multipart/form-data"
          >
            <h1 className="text-[24px] font-[600] text-[#192335]">Thêm mới sản phẩm</h1>
            <div className="form-group">
              <label htmlFor="title">Tiêu đề</label>
              <input
                onChange={(event) => setProductInfo({ ...productInfo, title: event.target.value })}
                type="text"
                id="title"
                name="title"
                className='py-[3px] text-[16px]'
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="product_category_id">Danh mục</label>
              <select
                name="product_category_id"
                id="product_category_id"
                className="outline-none border rounded-[5px] border-[#00171F] py-[3px] text-[16px]"
                value={productInfo.product_category_id}
                onChange={(event) => setProductInfo({ ...productInfo, product_category_id: event.target.value })}
              >
                <option value={''}>-- Chọn danh mục</option>
                {allProductCategories && allProductCategories.length > 0 && (
                  allProductCategories.map(productCategory => (
                    <SelectTreeProduct
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

            <div className="flex items-center justify-start gap-[10px] text-[16px]">
              <div className="flex gap-[5px]">
                <input
                  onChange={(event) => setProductInfo({ ...productInfo, featured: event.target.value })}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="featured1"
                  name="featured"
                  value={'1'}
                  checked={productInfo.featured === '1' ? true : false}
                />
                <label htmlFor="featured1">Nổi bật</label>
              </div>
              <div className="flex gap-[5px]">
                <input
                  onChange={(event) => setProductInfo({ ...productInfo, featured: event.target.value })}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="featured0"
                  name="featured"
                  value={'0'}
                  checked={productInfo.featured === '0' ? true : false}
                />
                <label htmlFor="featured0">Không nổi bật</label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="desc">Mô tả</label>
              <Editor
                apiKey={API_KEY}
                init={{
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
                }}
                onEditorChange={(newValue) => setProductInfo({ ...productInfo, description: newValue })}
                id="desc"
                textareaName="description"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Giá</label>
              <input
                onChange={(event) => setProductInfo({ ...productInfo, price: Number(event.target.value) })}
                type="number"
                id="price"
                name="price"
                className='text-[16px] py-[3px]'
                defaultValue={0}
                min={0}/>
            </div>

            <div className="form-group">
              <label htmlFor="discount">% Giảm giá</label>
              <input
                onChange={(event) => setProductInfo({ ...productInfo, discountPercentage: Number(event.target.value) })}
                type="number"
                id="discount"
                name="discountPercentage"
                className='text-[16px] py-[3px]'
                defaultValue={0}
                min={0}/>
            </div>

            <div className="form-group">
              <label htmlFor="stock">Số lượng</label>
              <input
                onChange={(event) => setProductInfo({ ...productInfo, stock: Number(event.target.value) })}
                type="number"
                id="stock"
                name="stock"
                defaultValue={0}
                className='text-[16px] py-[3px]'
                min={0}/>
            </div>

            {/* PHẦN ẢNH ĐẠI DIỆN */}
            <div className="flex flex-col gap-[5px]">
              <label htmlFor="thumbnail">Ảnh đại diện</label>
              <input
                onChange={handleThumbnailChange}
                ref={uploadImageInputRef}
                type="file" name="thumbnail" className='hidden' accept="image/*"
              />
              <button
                onClick={(event) => handleClick(event, uploadImageInputRef)}
                className="bg-gray-400 font-semibold border rounded-md w-fit px-3 py-1 text-sm text-white"
              >
                Chọn ảnh
              </button>
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Thumbnail preview" className="border rounded-md w-[150px] h-[150px] object-cover" />
              )}
            </div>

            {/* Phần quản lý màu sắc */}
            <div className="form-group">
              <label>Danh sách các màu</label>
              {/* Input thêm màu mới */}
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Tên màu (VD: Xanh rêu)"
                  value={currentColor.name}
                  onChange={(e) => setCurrentColor({ ...currentColor, name: e.target.value })}
                  className="flex-1 text-[16px] py-[3px] border rounded px-2"
                />
                <input
                  type="color"
                  value={currentColor.code}
                  onChange={(e) => setCurrentColor({ ...currentColor, code: e.target.value })}
                  className="h-[35px]"
                />
                <button type="button" onClick={handleAddColor} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Thêm
                </button>
              </div>
              {/* Danh sách các màu đã thêm */}
              <div className="flex flex-col gap-4 mt-2">
                {productInfo.colors.map((color, colorIndex) => (
                  <div key={colorIndex} className="border p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span style={{ backgroundColor: color.code }} className="w-6 h-6 rounded-full border"></span>
                        <span className='font-semibold'>{color.name}</span>
                      </div>
                      <button type="button" onClick={() => handleRemoveColor(colorIndex)} className="font-bold text-red-500">&times;</button>
                    </div>
                    <div className="mt-2">
                      <input
                        type="file"
                        multiple accept="image/*"
                        className="hidden"
                        ref={el => { colorFileInputRefs.current[colorIndex] = el }}
                        onChange={(e) => handleAddImagesToColor(colorIndex, e)}
                      />
                      <button
                        type="button"
                        onClick={() => colorFileInputRefs.current[colorIndex]?.click()}
                        className="bg-gray-200 px-3 py-1 text-sm rounded"
                      >
                        + Thêm ảnh
                      </button>
                    </div>
                    {/* Preview ảnh */}
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {color.images && color.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="relative group">
                          <img
                            src={image instanceof File ? URL.createObjectURL(image) : image}
                            className="w-full h-24 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageFromColor(colorIndex, imgIndex)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* === UI CHO DANH SÁCH KÍCH CỠ === */}
            <div className="form-group">
              <label>Danh sách kích cỡ</label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Nhập size (VD: M)"
                  value={currentSize}
                  onChange={(e) => setCurrentSize(e.target.value)}
                  className="flex-1 text-[16px] py-[3px] border rounded px-2"
                />
                <button type="button" onClick={handleAddSize} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productInfo.sizes.map((size, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm">
                    <span>{size}</span>
                    <button type="button" onClick={() => handleRemoveSize(index)} className="font-bold text-red-500">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="position">Vị trí</label>
              <input
                onChange={(event) => setProductInfo({ ...productInfo, position: Number(event.target.value) })}
                type="number"
                id="position"
                name="position"
                placeholder="Tự động tăng"
                value={productInfo ? productInfo.position : ''}
                className='text-[16px] py-[3px]'
                min={1}
              />
            </div>

            <div className="flex items-center justify-start gap-[5px] text-[16px]">
              <div className="flex gap-[5px]">
                <input
                  onChange={(event) => setProductInfo({ ...productInfo, status: event.target.value })}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="statusActive"
                  name="status"
                  value={'active'}
                  checked={productInfo.status === 'active' ? true : false}
                />
                <label htmlFor="statusActive">Hoạt động</label>
              </div>

              <div className="flex gap-[5px]">
                <input
                  onChange={(event) => setProductInfo({ ...productInfo, status: event.target.value })}
                  type="radio"
                  className="border rounded-[5px] border-[#192335]"
                  id="statusInActive"
                  name="status"
                  value={'inactive'}
                  checked={productInfo.status === 'inactive' ? true : false}
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

export default CreateProduct