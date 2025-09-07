import { motion } from 'framer-motion'

type CardItemProps = {
  title: string
  thumbnail: string
  price?: number
  discountPercentage?: number,
  featured?: string
}

const CardItem = ({
  title,
  thumbnail,
  price,
  discountPercentage,
  featured
}: CardItemProps) => {
  return (
    <>
      <motion.div
        whileHover={{ y: -1, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="flex flex-col gap-[15px] items-center border rounded-[5px] px-[5px] py-[10px] text-center cursor-pointer">
        <div className='relative'>
          <img
            src={thumbnail}
            alt={title}
            className="w-[293px] h-[290px] object-cover"
          />
          {featured === '1' && (
            <div className='absolute top-[-10px] left-[-35px] border rounded-[5px] px-[3px] py-[2px] border-[#607D00] text-white bg-[#0542AB]'>Nổi bật</div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-semibold text-[17px] line-clamp-1 hover:text-blue-900">
            {title}
          </span>

          {/* Nếu có price thì render block giá */}
          {price !== undefined && (
            <div className="flex items-center gap-2">
              {discountPercentage && discountPercentage > 0 ? (
                <>
                  <div className="font-medium">
                    {Math.floor(((price * (100 - discountPercentage)) / 100)).toLocaleString()}đ
                  </div>
                  <div className="line-through text-gray-400">
                    {price.toLocaleString()}đ
                  </div>
                  <div className="text-[#BC3433] font-semibold p-[2px] bg-amber-100 text-[12px]">
                    -{discountPercentage}%
                  </div>
                </>
              ) : (
                <div>{price.toLocaleString()}đ</div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default CardItem