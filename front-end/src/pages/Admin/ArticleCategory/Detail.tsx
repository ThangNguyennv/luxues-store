import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/admin/articleCategory/useDetail'

const DetailArticleCategory = () => {
  const {
    articleCategoryDetail,
    id
  } = useDetail()

  return (
    <>
      {articleCategoryDetail && (
        <div className='flex flex-col gap-[10px]'>
          <h1 className='text-[35px] font-[600] text-[#00171F] underline'>{articleCategoryDetail.title}</h1>
          <div>
            <img src={articleCategoryDetail.thumbnail} alt={articleCategoryDetail.title} className='w-[150px] h-[150px]'/>
          </div>
          <div>
            Trạng thái: <b>{articleCategoryDetail.status === 'active' ? <span className="text-green-500"> Hoạt động</span> : <span className="text-red-500"> Dừng hoạt động</span>}</b>
          </div>
          <div>
            Vị trí: <b>{articleCategoryDetail.position}</b>
          </div>
          <div>
            Mô tả ngắn: <div dangerouslySetInnerHTML={{ __html: articleCategoryDetail.descriptionShort }} />
          </div>
          <div>
            Mô tả chi tiết: <div dangerouslySetInnerHTML={{ __html: articleCategoryDetail.descriptionDetail }} />
          </div>
          <Link to={`/admin/articles-category/edit/${id}`} className='cursor-pointer border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'>Chỉnh sửa</Link>
        </div>
      )}
    </>
  )
}

export default DetailArticleCategory