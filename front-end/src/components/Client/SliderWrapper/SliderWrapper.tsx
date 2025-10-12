import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import CardItem from '../CardItem/CardItem'
import { Link } from 'react-router-dom'

export type BaseItem = {
  slug?: string,
  title: string
  thumbnail: string
  price?: number
  discountPercentage?: number,
  featured?: string
}

interface SliderWrapperProps {
  items: BaseItem[]
  slidesPerView?: number
  autoplayDelay?: number
}

export default function SliderWrapper ({
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
          <Link to={`/products/detail/${item.slug}`}>
            <CardItem {...item} />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}