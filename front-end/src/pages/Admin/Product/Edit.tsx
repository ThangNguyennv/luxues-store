import { AlertToast } from '~/components/alert/Alert'
import { Editor } from '@tinymce/tinymce-react'
import { API_KEY } from '~/utils/constants'
import { useEdit } from '~/hooks/admin/product/useEdit'

const EditProduct = () => {
  const {
    productInfo,
    setProductInfo,
    alertOpen,
    setAlertOpen,
    alertMessage,
    alertSeverity,
    uploadImageInputRef,
    uploadImagePreviewRef,
    handleChange,
    handleSubmit
  } = useEdit()
  return (
    <>
      <AlertToast
        open={alertOpen}
        message={alertMessage}
        onClose={() => setAlertOpen(false)}
        severity={alertSeverity}
      />
      <h1 className="text-[40px] font-[600] text-[#192335]">Chỉnh sửa sản phẩm</h1>
      {productInfo && (
        <form onSubmit={(event) => handleSubmit(event)} action="" className="flex flex-col gap-[10px]" encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">Tiêu đề</label>
            <input onChange={(event) => setProductInfo(productInfo ? { ...productInfo, title: event.target.value } : productInfo)} type="text" id="title" name="title" value={productInfo.title}/>
          </div>

          <div className="form-group">
            <label htmlFor="product_category_id">Danh mục</label>
            <select name="product_category_id" id="product_category_id" className="border rounded-[5px] border-[#00171F]">
              <option value={''}>-- Chọn danh mục</option>
            </select>
          </div>

          <div className="flex items-center justify-start gap-[5px]">
            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setProductInfo(productInfo ? { ...productInfo, featured: event.target.value }: productInfo)}
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
                onChange={(event) => setProductInfo(productInfo ? { ...productInfo, featured: event.target.value }: productInfo)}
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
              value={productInfo.description}
              onEditorChange={(newValue) => setProductInfo(productInfo ? { ...productInfo, description: newValue }: productInfo)}
              id="desc"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá</label>
            <input
              onChange={(event) => setProductInfo(productInfo ? { ...productInfo, price: Number(event.target.value) }: productInfo)}
              type="number"
              id="price"
              name="price"
              value={productInfo.price}
              min={0}/>
          </div>

          <div className="form-group">
            <label htmlFor="discount">% Giảm giá</label>
            <input
              onChange={(event) => setProductInfo(productInfo ? { ...productInfo, discountPercentage: Number(event.target.value) }: productInfo)}
              type="number"
              id="discount"
              name="discountPercentage"
              value={productInfo.discountPercentage}
              min={0}/>
          </div>

          <div className="form-group">
            <label htmlFor="stock">Số lượng</label>
            <input
              onChange={(event) => setProductInfo(productInfo ? { ...productInfo, stock: Number(event.target.value) }: productInfo)}
              type="number"
              id="stock"
              name="stock"
              value={productInfo.stock}
              min={0}/>
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
              src={productInfo.thumbnail}
              className="w-[150px] h-auto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Vị trí</label>
            <input
              onChange={(event) => setProductInfo(productInfo ? { ...productInfo, position: Number(event.target.value) }: productInfo)}
              type="number"
              id="position"
              name="position"
              placeholder="Tự động tăng"
              min={1}
              value={productInfo.position}
            />
          </div>

          <div className="flex items-center justify-start gap-[5px]">
            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setProductInfo(productInfo ? { ...productInfo, status: event.target.value }: productInfo)}
                type="radio"
                className="border rounded-[5px] border-[#192335]"
                id="statusActove"
                name="status"
                value={'active'}
                checked={productInfo.status === 'active' ? true : false}
              />
              <label htmlFor="statusActove">Hoạt động</label>
            </div>

            <div className="flex gap-[5px]">
              <input
                onChange={(event) => setProductInfo(productInfo ? { ...productInfo, status: event.target.value }: productInfo)}
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

          <button type="submit" className="cursor-pointer w-[10%] border rounded-[5px] bg-[#525FE1] text-white p-[7px]">Cập nhật</button>
        </form>
      )}
    </>
  )
}

export default EditProduct