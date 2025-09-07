import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import SliderWrapper from '~/components/client/SliderWrapper/SliderWrapper'
import { useHome } from '~/contexts/client/HomeContext'

const Section5 = () => {
  const { dataHome } = useHome()
  return (
    <>
      {/* Section 5 */}
      <div className="border-t border-[#0000001A]">
        <div className="container mx-auto px-[16px]">
          <div className="sm:px-[64px] px-[24px] sm:rounded-[40px] rounded-[20px]">
            <BoxHead title={'Bài viết mới'} />
            {dataHome?.articlesNew && (
              <SliderWrapper items={dataHome.articlesNew} />
            )}
            <div className="text-center border-[#0000001A] sm:pt-[40px] pt-[30px] sm:pb-[62px] pb-[26px]">
              <Link
                className="nav-link border-[1px] text-[16px] font-[500] px-[63px] py-[16px] rounded-[62px] text-black inline-block sm:w-auto w-[100%] hover:bg-amber-300" to="#">
              Xem Tất Cả
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* End Section 5 */}
    </>
  )
}

export default Section5