import { Link } from 'react-router-dom'
import BoxHead from '~/components/client/BoxHead/BoxHead'
import CardItem from '~/components/client/CardItem/CardItem'
import { useHome } from '~/contexts/client/HomeContext'

const ProductsNew = () => {
  const { dataHome } = useHome()

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="container flex flex-col mb-[100px]">
          <BoxHead title={'Thời trang mới'}/>
          {dataHome && (
            <div className='grid grid-cols-4 gap-[15px]'>
              {dataHome.productsNew.map((product, index) => (
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

export default ProductsNew