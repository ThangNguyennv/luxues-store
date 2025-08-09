import { Snackbar, Alert } from '@mui/material'
import { useAlertContext } from '~/contexts/admin/AlertContext'

export const AlertToast = () => {
  const { state, dispatch } = useAlertContext()
  const { open, message, severity } = state
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => dispatch({ type: 'HIDE_ALERT' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => dispatch({ type: 'HIDE_ALERT' })}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

