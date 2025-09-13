import { useAuth } from '~/contexts/admin/AuthContext'

const BrandCategory = () => {
  const { role } = useAuth()
  return (
    <>
      {role && role.permissions.includes('brands-category_view') && (
        <div>Đang cập nhật...</div>
      )}
    </>
  )
}

export default BrandCategory