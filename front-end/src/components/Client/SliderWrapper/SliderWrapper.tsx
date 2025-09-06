import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import CardItem from '../CardItem/CardItem'

type BaseItem = {
  title: string
  thumbnail: string
  price?: number
  discountPercentage?: number
}

interface SliderWrapperProps {
  items: BaseItem[]
  slidesPerView?: number
  autoplayDelay?: number
}

export default function SliderWrapper({
  items,
  slidesPerView = 4,
  autoplayDelay = 3000
}: SliderWrapperProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={15}
      slidesPerView={slidesPerView}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      autoplay={{
        delay: autoplayDelay,
        disableOnInteraction: false
      }}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          <CardItem {...item} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}