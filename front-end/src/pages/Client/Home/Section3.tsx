import { Link } from 'react-router-dom'
import CardItem from '~/components/client/CardItem/CardItem'
import { useHome } from '~/contexts/client/HomeContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
const Section3 = () => {
  const { dataHome } = useHome()

  return (
    <>
      {/* Section 3 */}
      <div className="sm:py-[62px] py-[40px]">
        <div className="container mx-auto px-[16px]">
          <h2 className="text-center font-[700] sm:text-[48px] text-[32px] text-primary sm:mb-[54px] mb-[32px]">
            THỜI TRANG MỚI
          </h2>
          {dataHome && dataHome.productsNew && (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={15}
              slidesPerView={4}
              navigation
              pagination={{ clickable: true }}
              loop={true} // 🔥 Cho phép quay vòng vô hạn
              autoplay={{
                delay: 3000, // 3 giây đổi slide
                disableOnInteraction: false
              }}
            >
              {dataHome.productsNew.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col gap-[16px] items-center text-center">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-[298px] h-[295px] object-cover"
                    />
                    <div className="flex flex-col gap-[8px] items-center">
                      <span className="font-[600] text-[17px]">{item.title}</span>
                      <div className="flex items-center gap-[10px]">
                        <div className="font-[500]">{item.price.toLocaleString()}đ</div>
                        <div className="line-through text-gray-400">
                          {item.price.toLocaleString()}đ
                        </div>
                        <div className="text-[#BC3433]">-{item.discountPercentage}%</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div className="text-center sm:bt-[40px] mt-[30px]">
            <Link
              className="border border-[#0000001A] rounded-[62px] py-[16px] px-[63px] font-[500] sm:text-[16px] text-[14px] text-black inline-block sm:w-auto w-[100%]"
              to="#"
            >
              Xem Tất Cả
            </Link>
          </div>
        </div>
      </div>
      {/* End Section 3 */}
    </>
  )
}

export default Section3