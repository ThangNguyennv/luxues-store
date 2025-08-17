import { Link } from 'react-router-dom'
import { useDetail } from '~/hooks/admin/article/useDetail'

const DetailArticle = () => {
  const {
    articleDetail,
    id
  } = useDetail()

  return (
    <>
      {articleDetail && (
        <div className='flex flex-col gap-[10px]'>
          <h1 className='text-[35px] font-[600] text-[#00171F] underline'>{articleDetail.title}</h1>
          <div>
            <img src={articleDetail.thumbnail} alt={articleDetail.title} className='w-[150px] h-[150px]'/>
          </div>
          <div>
            Trạng thái:
            <b>
              {
                articleDetail.status === 'active' ?
                  <span className="text-green-500">Hoạt động</span> :
                  <span className="text-red-500"> Dừng hoạt động</span>
              }
            </b>
          </div>
          <div>
            Vị trí: <b>{articleDetail.position}</b>
          </div>
          <div>
            Mô tả ngắn: <div dangerouslySetInnerHTML={{ __html: articleDetail.descriptionShort }} />
          </div>
          <div>
            Mô tả chi tiết: <div dangerouslySetInnerHTML={{ __html: articleDetail.descriptionDetail }} />
          </div>
          <Link
            to={`/admin/articles/edit/${id}`}
            className='cursor-pointer border rounded-[5px] bg-[#FFAB19] p-[5px] text-white w-[100px] text-center'
          >
            Chỉnh sửa
          </Link>
        </div>
      )}
    </>
  )
}

export default DetailArticle