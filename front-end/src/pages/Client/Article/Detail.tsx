import useDetail from '~/hooks/client/article/useDetail'

const DetailArticleClient = () => {
  const {
    articleDetail
  } = useDetail()

  return (
    <>
      {articleDetail && (
        <>
          <div className="flex items-center justify-center p-[30px] mb-[100px] bg-[#FFFFFF] shadow-md">
            <div className="container flex border rounded-[5px]">
              <div className='w-[50%] flex items-center justify-center'>
                <img
                  src={articleDetail.thumbnail}
                  alt={articleDetail.title}
                  className='w-[440px] h-[530px] object-cover'
                />
              </div>
              <div className='flex flex-col justify-center gap-[30px] w-[50%]'>
                <div className='font-[600] text-[32px]'>{articleDetail.title}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default DetailArticleClient