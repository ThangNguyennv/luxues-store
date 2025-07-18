const Section3 = () => {
  return (
    <>
      {/* Section 3 */}
      <div className="sm:py-[62px] py-[40px]">
        <div className="container mx-auto px-[16px]">
          <h2 className="text-center font-[700] sm:text-[48px] text-[32px] text-primary sm:mb-[54px] mb-[32px]">
            THỜI TRANG MỚI
          </h2>
          <div className="swiper swiperSection3">
            <div className="swiper-wrapper"></div>
            <div className="swiper-pagination"></div>
          </div>
          <div className="text-center sm:bt-[40px] mt-[30px]">
            <a className="border border-[#0000001A] rounded-[62px] py-[16px] px-[63px] font-[500] sm:text-[16px] text-[14px] text-black inline-block sm:w-auto w-[100%]" href="#">
              Xem Tất Cả
            </a>
          </div>
        </div>
      </div>
      {/* End Section 3 */}
    </>
  )
}

export default Section3