import { Link } from 'react-router-dom'
import { useHome } from '~/contexts/client/HomeContext'
import SliderWrapper from '~/components/client/SliderWrapper/SliderWrapper'
import BoxHead from '~/components/client/BoxHead/BoxHead'

const Section3 = () => {
  const { dataHome } = useHome()
  return (
    <>
      {/* Section 3 */}
      <div className="sm:py-[62px] py-[40px]">
        <div className="container mx-auto px-[16px]">
          <BoxHead title={'Thời trang mới'}/>
          {dataHome?.productsNew && (
            <SliderWrapper items={dataHome.productsNew} />
          )}
          <div className="text-center sm:bt-[40px] mt-[30px]">
            <Link
              className="
                nav-link border border-[#0000001A]
                rounded-[62px] py-[16px] px-[63px]
                font-[500] sm:text-[16px] text-[14px]
                text-black inline-block sm:w-auto
                w-[100%] hover:bg-amber-300
              "
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