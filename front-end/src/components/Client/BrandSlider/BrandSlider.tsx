import type { BaseItem } from '../SliderWrapper/SliderWrapper'
import CardItem from '../CardItem/CardItem'
import { Link } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

interface BrandSliderProps {
  items: BaseItem[]
}

export default function BrandSlider({ items }: BrandSliderProps) {
  return (
    <div className="overflow-hidden bg-gray-100 py-4">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={4} // số item hiển thị cùng lúc
        spaceBetween={20} // khoảng cách giữa item
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={3000} // tốc độ (ms) để trượt hết 1 vòng
        loop={true}
        freeMode={true} // cho phép kéo tự do
        grabCursor={true} // đổi con trỏ chuột thành “nắm kéo”
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <Link to={`/products/detail/${item.slug}`}>
              <CardItem {...item} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}