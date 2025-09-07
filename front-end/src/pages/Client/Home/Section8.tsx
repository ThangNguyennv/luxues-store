import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import SliderWrapper from '~/components/client/SliderWrapper/SliderWrapper'
import { useHome } from '~/contexts/client/HomeContext'

const Section8 = () => {
  const { dataHome } = useHome()
  return (
    <>
      {/* Section 6 */}
      <div className="sm:pb-[86px] pb-[40px]">
        <div className="container mx-auto px-[16px]">
          <div className="bg-[#F0F0F0] sm:py-[70px] py-[28px] sm:px-[64px] px-[24px] sm:rounded-[40px] rounded-[20px]">
            <BoxHead title={'Bài viết nổi bật'}/>
            {dataHome?.articlesFeatured && (
              <SliderWrapper items={dataHome.articlesFeatured} />
            )}
            <div className="text-center border-[#0000001A] sm:pt-[40px] pt-[30px] sm:pb-[76px] pb-[40px]">
              <Link
                className="nav-link border-[1px] text-[16px] font-[500] px-[63px] py-[16px] rounded-[62px] text-black inline-block sm:w-auto w-[100%] hover:bg-amber-300" to="#">
              Xem Tất Cả
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 6 */}
    </>
  )
}

export default Section8