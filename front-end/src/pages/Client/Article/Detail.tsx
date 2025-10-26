import useDetail from '~/hooks/client/article/useDetail'
import Skeleton from '@mui/material/Skeleton'
import { FaUserCircle } from 'react-icons/fa'

// Component Skeleton UI
const DetailArticleSkeleton = () => (
  <div className="container max-w-3xl mx-auto px-4 py-8 md:py-16">
    <Skeleton variant="text" width="80%" height={60} sx={{ fontSize: '2.5rem' }} />
    <div className="flex items-center gap-4 my-6">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex flex-col gap-1">
        <Skeleton variant="text" width={120} height={20} />
        <Skeleton variant="text" width={100} height={16} />
      </div>
    </div>
    <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '16/9' }} />
    <div className="mt-8">
      <Skeleton variant="text" width="100%" height={24} />
      <Skeleton variant="text" width="100%" height={24} />
      <Skeleton variant="text" width="70%" height={24} />
    </div>
  </div>
)

const DetailArticleClient = () => {
  const {
    articleDetail,
    loading // Lấy state loading từ hook
  } = useDetail()

  // Hiển thị Skeleton khi đang tải
  if (loading) {
    return <DetailArticleSkeleton />
  }

  // Hiển thị khi không tìm thấy bài viết
  if (!articleDetail) {
    return <div className='text-center my-20'>Không tìm thấy bài viết.</div>
  }

  // Giao diện chính
  return (
    <div className="bg-white py-12 md:py-20">
      {/* Container giới hạn chiều rộng để dễ đọc */}
      <div className="container max-w-3xl mx-auto px-4 mb-[50px]">
        <article>
          {/* Tiêu đề bài viết */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {articleDetail.title}
          </h1>

          {/* Thông tin tác giả và ngày đăng */}
          <div className="flex items-center gap-4 mb-8 text-gray-500">
            <FaUserCircle size={24} className="text-gray-400" />
            <div>
              <p className="font-semibold">{articleDetail.accountFullName || 'Admin'}</p>
              <p className="text-sm">
                {new Date(articleDetail.createdAt!).toLocaleDateString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Ảnh đại diện */}
          {/* <img
            src={articleDetail.thumbnail}
            alt={articleDetail.title}
            className='w-full h-auto aspect-video object-cover rounded-lg shadow-lg mb-8'
          /> */}

          {/* Nội dung chi tiết bài viết */}
          <div
            // Tailwind `prose` tự động định dạng HTML (p, h2, ul, ...)
            className='prose prose-lg max-w-none'
            dangerouslySetInnerHTML={{ __html: articleDetail.descriptionDetail }}
          />
        </article>
      </div>
    </div>
  )
}

export default DetailArticleClient
