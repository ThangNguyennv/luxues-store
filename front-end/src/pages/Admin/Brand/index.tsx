import { useAuth } from '~/contexts/admin/AuthContext'

const Brand = () => {
  const { role } = useAuth()
  return (
    <>
      {role && role.permissions.includes('brands_view') && (
        <div>Đang cập nhật...</div>
      )}
    </>
  )
}

export default Brand