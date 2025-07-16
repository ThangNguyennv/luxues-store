import Alert from '@mui/material/Alert'
import CheckIcon from '@mui/icons-material/Check'

function App() {
  return (
    <>
      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Here is a gentle confirmation that your action was successful.
      </Alert>
    </>
  )
}

export default App
