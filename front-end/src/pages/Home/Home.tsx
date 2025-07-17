import backgroundHome from '~/assets/images/Home/background-home.png'
import star from '~/assets/images/Home/star.svg'
import partner1 from '~/assets/images/Home/partner-1.svg'
import partner2 from '~/assets/images/Home/partner-2.svg'
import partner3 from '~/assets/images/Home/partner-3.svg'
import partner4 from '~/assets/images/Home/partner-4.svg'
import partner5 from '~/assets/images/Home/partner-5.svg'

const Home = () => {
  let productListNew = [
    {
      image: 'assets/images/product-1.jpg',
      title: 'Áo Thun Nam Đơn Giản',
      link: '#',
      stars: 4,
      price: 600000
    },
    {
      image: 'assets/images/product-1.jpg',
      title: 'Áo Thun Nam Đơn Giản',
      link: '#',
      stars: 4,
      price: 600000
    },
    {
      image: 'assets/images/product-2.jpg',
      title: 'Quần Jean Nam Phong Cách',
      link: '#',
      stars: 5,
      price: 600000,
      priceSpecial: 480000,
      discount: 20
    },
    {
      image: 'assets/images/product-3.jpg',
      title: 'Áo Sơ Mi Caro',
      link: '#',
      stars: 3,
      price: 220000
    },
    {
      image: 'assets/images/product-3.jpg',
      title: 'Áo Sơ Mi Caro',
      link: '#',
      stars: 3,
      price: 220000
    },
    {
      image: 'assets/images/product-4.jpg',
      title: 'Áo Thun Nam Sọc Cam',
      link: '#',
      stars: 0,
      price: 180000,
      priceSpecial: 126000,
      discount: 30
    }
  ]
  return (
    <>
      {/* Section 1 */}
      <div className="bg-[#F2F0F1] truncate">
        <div className="container mx-auto px-[16px] whitespace-normal">
          <div className="flex flex-wrap items-center" data-aos="fade-up" data-aos-duration="2000">
            <div className="lg:w-[48.6%] w-[100%] lg:mt-[0] mt-[40px]">
              <h1 className="font-[900] xl:text-[48px] sm:text-[32px] text-[28px] text-primary mb-[10px]" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="300">
                CHUYÊN THỜI TRANG PHONG CÁCH, HIỆN ĐẠI
              </h1>
              <p className="font-[400] xl:text-[16px] text-[14px] text-[#00000099] xl:mb-[50px] mb-[30px]" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="200">
                Chúng tôi chuyên cung cấp nhiều loại quần áo được chế tác tỉ mỉ, được thiết kế để làm nổi bật cá tính của bạn và đáp ứng phong cách của bạn.
              </p>
              <a className="sm:inline-block block text-center bg-primary rounded-[62px] py-[16px] px-[64px] font-[500] text-[16px] text-white" href="#" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="150">
                Xem Ngay
              </a>
              <div className="flex flex-wrap xl:mt-[50px] mt-[30px] sm:justify-start justify-center sm:text-left text-center sm:gap-[0] gap-x-[75px] gap-y-[10px]">
                <div className="sm:pr-[32px] sm:border-r border-[#0000001A] sm:mr-[32px]">
                  <div className="text-primary xl:text-[40px] text-[24px] font-[700]">200+</div>
                  <div className="font-[400] xl:text-[16px] text-[12px] text-[#00000099]">Thương Hiệu</div>
                </div>
                <div className="sm:pr-[32px] sm:border-r border-[#0000001A] sm:mr-[32px]">
                  <div className="text-primary xl:text-[40px] text-[24px] font-[700]">2,000+</div>
                  <div className="font-[400] xl:text-[16px] text-[12px] text-[#00000099]">Sản Phẩm Chất Lượng</div>
                </div>
                <div className="sm:pr-[32px] sm:border-r border-[#0000001A] sm:mr-[32px]">
                  <div className="text-primary xl:text-[40px] text-[24px] font-[700]">30,000+</div>
                  <div className="font-[400] xl:text-[16px] text-[12px] text-[#00000099]">Khách Hàng</div>
                </div>
              </div>
            </div>
            <div className="relative xl:ml-[60px] lg:flex-1 flex-none w-[100%]" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="150">
              <img className="w-[100%]" src={ backgroundHome } alt="bg-section1"/>
              <img className="w-[56px] absolute left-[0] top-[48%] sm:block hidden" src={ star }/>
              <img className="w-[104px] absolute right-[0] top-[14%] sm:block hidden" src={ star }/>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 1 */}

      {/* Section 2 */}
      <div className="bg-primary sm:py-[44px] py-[40px]">
        <div className="container mx-auto px-[16px]">
          <div className="flex flex-wrap justify-center sm:gap-x-[60px] gap-x-[34px] gap-y-[28px] viewerSection2">
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner1 } alt="Partner 1"/>
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner2 } alt="Partner 2"/>
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner3 } alt="Partner 3"/>
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner4 } alt="Partner 4"/>
            <img className="sm:h-[32px] h-[22px] w-auto" src={ partner5 } alt="Partner 5"/>
          </div>
        </div>
      </div>
      {/* End Section 2 */}

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

      {/* Section 4 */}
      <div className="sm:pt-[62px] pt-[40px] border-t border-[#0000001A]">
        <div className="container mx-auto px-[16px]">
          <h2 className="text-center font-[700] sm:text-[48px] text-[32px] text-primary sm:mb-[54px] mb-[32px]">GIẢM GIÁ NHIỀU</h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-[20px] gap-y-30px"></div>
          <div className="text-center border-[#0000001A] sm:pt-[40px] pt-[30px] sm:pb-[76px] pb-[40px]">
            <a className="border-[1px] text-[16px] font-[500] px-[63px] py-[16px] rounded-[62px] text-black inline-block sm:w-auto w-[100%]" href="#">
              Xem Tất Cả
            </a>
          </div>
        </div>
      </div>
      {/* End Section 4 */}

      {/* Section 5 */}
      <div className="sm:pb-[86px] pb-[40px]">
        <div className="container mx-auto px-[16px]">
          <div className="bg-[#F0F0F0] sm:py-[70px] py-[28px] sm:px-[64px] px-[24px] sm:rounded-[40px] rounded-[20px]">
            <h2 className="text-center font-[700] sm:text-[48px] text-[32px] text-primary sm:mb-[60px] mb-[16px]">DANH MỤC NỔI BẬT</h2>
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-[20px]">
            </div>
          </div>
        </div>
      </div>
      {/* End Section 5 */}

      {/* Section 6 */}
      <div className="pb-[80px]">
        <div className="container mx-auto px-[16px]">
          <div>
            <h2 className="flex flex-wrap font-[700] sm:text-[48px] text-[32px] text-primary sm:mb-[38px] mb-[32px]">CẢM NHẬN CỦA KHÁCH HÀNG</h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-[20px]">
            </div>
          </div>
        </div>
      </div>
      {/* End Section 6 */}

      {/* Section 7 */}
      <div className="relative">
        <div className="container mx-auto px-[16px]">
          <div className="flex flex-wrap items-center justify-between bg-primary rounded-[20px] md:px-[64px] px-[24px] md:py-[38px] py-[32px]">
            <h2 className="text-[#FFFFFF] xl:text-[40px] text-[32px] font-[700] xl:w-[551px] lg:w-[450px] w-[100%] lg:mb-[0] mb-[20px]">
              CẬP NHẬT VỀ ƯU ĐÃI MỚI NHẤT CỦA CHÚNG TÔI
            </h2>
            <form className="flex flex-col sm:gap-[14px] gap-[12px] lg:w-[349px] w-[100%]">
              <div className="flex gap-[12px] text-center items-center px-[16px] py-[12px] bg-[#FFFFFF] rounded-[62px] sm:text-[16px] text-[14px] font-[400]">
                <i className="fa-regular fa-envelope text-[20px] text-[#00000066]"></i>
                <input className="flex-1" type="email" placeholder="Nhập email của bạn..."/>
              </div>
              <button className="text-center py-[12px] bg-[#FFFFFF] rounded-[62px] sm:text-[16px] text-[14px] font-[500]">Đăng Ký Nhận Tin</button>
            </form>
          </div>
        </div>
      </div>
      {/* End Section 7 */}
    </>
  )
}

export default Home