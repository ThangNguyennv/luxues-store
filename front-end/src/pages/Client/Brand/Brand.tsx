import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from '@mui/material/Skeleton'
import { fetchClientBrandsAPI } from '~/apis/client/brand.api'
import type { Brand } from '~/types/brand.type'

// Kiểu dữ liệu cho dữ liệu trả về từ API (đã nhóm)
interface BrandGroup {
  categoryTitle: string
  categorySlug?: string
  brands: Brand[]
}

// Component Skeleton cho Brand Card
const BrandSkeleton = () => (
  <div className="flex flex-col items-center gap-3 p-4 border rounded-lg shadow-sm">
    <Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: '8px' }} />
    <Skeleton variant="text" width={80} height={24} />
  </div>
)

const BrandPage = () => {
  const [brandGroups, setBrandGroups] = useState<BrandGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetchClientBrandsAPI()
        if (res.code === 200) {
          setBrandGroups(res.data)
        }
      } catch (error) {
        console.error('Lỗi khi fetch thương hiệu:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 mb-[100px]">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Tất Cả Thương Hiệu
      </h1>

      {loading ? (
        // === Trạng thái Loading ===
        <div className="flex flex-col gap-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton variant="text" width={250} height={40} sx={{ fontSize: '1.875rem' }} />
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, j) => (
                  <BrandSkeleton key={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : brandGroups.length > 0 ? (
        // === Hiển thị dữ liệu ===
        <div className="flex flex-col gap-12">
          {brandGroups.map((group) => (
            <section key={group.categoryTitle}>
              {/* Tiêu đề danh mục */}
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-b pb-3">
                {group.categoryTitle}
              </h2>
              {/* Lưới các thương hiệu */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {group.brands.map((brand) => (
                  <Link
                    to={`/products?brand=${brand.slug}`} // Link tới trang sản phẩm, lọc theo brand
                    key={brand._id}
                    className="flex flex-col items-center gap-3 p-4 border rounded-lg shadow-sm bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <img
                      src={brand.thumbnail} // Dùng thumbnail làm logo
                      alt={brand.title}
                      className="w-28 h-28 object-contain"
                    />
                    <span className="font-semibold text-gray-800">{brand.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        // === Trạng thái rỗng ===
        <p className="text-center text-gray-500 py-16">
          Không tìm thấy thương hiệu nào.
        </p>
      )}
    </div>
  )
}

export default BrandPage

