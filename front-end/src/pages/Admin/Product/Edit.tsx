import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchDetailProductAPI, fetchEditProductAPI } from '~/apis'
import type { ProductDetailInterface, ProductInterface } from '~/components/Admin/Types/Interface'
import { AlertToast } from '~/components/Alert/Alert'
import { stripHTML } from '~/utils/stripHTML'

const EditProduct = () => {
  const [productInfo, setProductInfo] = useState<ProductDetailInterface | null>(null)
  const params = useParams()
  const id = params.id as string
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success')
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    fetchDetailProductAPI(id)
      .then((response: ProductInterface) => {
        setProductInfo(response.product)
      })
  }, [id])

  const uploadImageInputRef = useRef<HTMLInputElement | null>(null)
  const uploadImagePreviewRef = useRef<HTMLImageElement | null>(null)
  const handleChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (file && uploadImagePreviewRef.current) {
      uploadImagePreviewRef.current.src = URL.createObjectURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!productInfo) return

    const formData = new FormData(event.currentTarget)
    formData.set('title', productInfo.title)
    formData.set('featured', productInfo.featured)
    formData.set('description', productInfo.description)
    formData.set('price', productInfo.price.toString())
    formData.set('discountPercentage', productInfo.discountPercentage.toString())
    formData.set('stock', productInfo.stock.toString())
    formData.set('position', productInfo.position.toString())

    const response = await fetchEditProductAPI(id, formData)
    if (response.code === 200) {
      setAlertMessage('Đã cập nhật thành công sản phẩm!')
      setAlertSeverity('success')
      setAlertOpen(true)
      setTimeout(() => {
        navigate(`/admin/products/detail/${id}`)
      }, 2000)
    }
  }
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
            <textarea
              onChange={(event) => setProductInfo(productInfo ? { ...productInfo, description: event.target.value }: productInfo)}
              name="description" id="desc"
              className="textarea-mce outline-none"
              rows={5}
            >
              {stripHTML(productInfo.description)}
            </textarea>
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