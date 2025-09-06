import { Link } from 'react-router-dom'
import SliderWrapper from '~/components/client/SliderWrapper/SliderWrapper'
import { useHome } from '~/contexts/client/HomeContext'

const Section4 = () => {
  const { dataHome } = useHome()
  return (
    <>
      {/* Section 4 */}
      <div className="sm:pt-[62px] pt-[40px] border-t border-[#0000001A]">
        <div className="container mx-auto px-[16px]">
          <h2 className="text-center font-[700] sm:text-[48px] text-[32px] text-primary sm:mb-[54px] mb-[32px] uppercase">Sản phẩm nổi bật</h2>
          {dataHome?.productsFeatured && (
            <SliderWrapper items={dataHome.productsFeatured} />
          )}
          <div className="text-center border-[#0000001A] sm:pt-[40px] pt-[30px] sm:pb-[76px] pb-[40px]">
            <Link
              className="nav-link border-[1px] text-[16px] font-[500] px-[63px] py-[16px] rounded-[62px] text-black inline-block sm:w-auto w-[100%] hover:bg-amber-300" to="#">
              Xem Tất Cả
            </Link>
          </div>
        </div>
      </div>
      {/* End Section 4 */}
    </>
  )
}

export default Section4