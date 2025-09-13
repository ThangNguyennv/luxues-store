import { useAuth } from '~/contexts/admin/AuthContext'

const Trash = () => {
  const { role } = useAuth()

  return (
    <>
      {role && role.permissions.includes('trashs_view') && (
        <h1>Trash</h1>
      )}
    </>
  )
}

export default Trash