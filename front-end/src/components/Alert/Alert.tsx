import { Snackbar, Alert, type AlertColor } from '@mui/material'

interface ToastAlertProps {
  open: boolean
  message: string
  severity?: AlertColor
  onClose: () => void
}

export const AlertToast = ({ open, message, severity, onClose }: ToastAlertProps) => {
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}

