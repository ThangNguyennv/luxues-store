type CardItemProps = {
  title: string
  thumbnail: string
  price?: number
  discountPercentage?: number
}

const CardItem = ({
  title,
  thumbnail,
  price,
  discountPercentage,
}: CardItemProps) => {
  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <img
          src={thumbnail}
          alt={title}
          className="w-[298px] h-[295px] object-cover"
        />
        <div className="flex flex-col items-center gap-2">
          <span className="font-semibold text-[17px] line-clamp-1">
            {title}
          </span>

          {/* Nếu có price thì render block giá */}
          {price !== undefined && (
            <div className="flex items-center gap-2">
              {discountPercentage && discountPercentage > 0 ? (
                <>
                  <div className="font-medium">
                    {(
                      (price * (100 - discountPercentage)) /
                    100
                    ).toLocaleString()}
                  đ
                  </div>
                  <div className="line-through text-gray-400">
                    {price.toLocaleString()}đ
                  </div>
                  <div className="text-[#BC3433] font-semibold p-[1px] bg-amber-100 text-[12px]">
                  -{discountPercentage}%
                  </div>
                </>
              ) : (
                <div>{price.toLocaleString()}đ</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CardItem