import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import { useHome } from '~/contexts/client/HomeContext'

const ProductsFeatured = () => {
  const { dataHome } = useHome()

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px]">
          <BoxHead title={'Sản phẩm nổi bật'}/>
          {dataHome && (
            <div className='grid grid-cols-4 gap-[15px]'>
              {dataHome.productsFeatured.map((product, index) => (
                <Link to={`/products/detail/${product.slug}`} key={index}>
                  <CardItem {...product}/>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductsFeatured