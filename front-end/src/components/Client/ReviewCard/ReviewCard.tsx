import { FaStar } from 'react-icons/fa6'
import type { ProductInfoInterface } from '~/types/product.type'

// Lấy kiểu dữ liệu của một comment từ ProductInfoInterface
type Comment = ProductInfoInterface['comments'][0];

interface ReviewCardProps {
  comment: Comment;
  userName: string,
  userAvatar: string
}

const ReviewCard = ({ comment, userName, userAvatar }: ReviewCardProps) => {
  return (
    <div className="flex gap-4 py-6 border-b">
      {/* Cột Avatar */}
      <div className="flex-shrink-0">
        <img src={userAvatar} alt={userName} className="w-12 h-12 rounded-full object-cover" />
      </div>

      {/* Cột Nội dung Đánh giá */}
      <div className="flex-1">
        <p className="font-semibold">{userName}</p>
        <div className="flex items-center gap-1 text-yellow-500 my-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar key={i} className={i < comment.rating ? 'text-yellow-500' : 'text-gray-300'} />
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {new Date(comment.createdAt!).toLocaleDateString('vi-VN')}
        </p>
        {/* --- THÊM PHẦN HIỂN THỊ PHÂN LOẠI HÀNG --- 🏷️ */}
        {(comment.color || comment.size) && (
          <p className="text-sm text-gray-500 mt-2">
            Phân loại hàng: {comment.color}{comment.color && comment.size ? ', ' : ''}{comment.size}
          </p>
        )}
        <p className="mt-3 text-gray-700">{comment.content}</p>

        {/* Hiển thị ảnh/video đính kèm */}
        {comment.images && comment.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {comment.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-24 h-24 object-cover rounded-md cursor-pointer"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewCard