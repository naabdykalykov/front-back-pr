import React, { useState, useEffect } from 'react'
import { Snackbar, Alert, IconButton } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

function NotificationSnackbar({ notification, onClose }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (notification) {
      setOpen(true)
    }
  }, [notification])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
    if (onClose) {
      setTimeout(() => onClose(), 100)
    }
  }

  if (!notification) return null

  const { message, type = 'info', autoHideDuration = 6000 } = notification

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          minWidth: { xs: '280px', sm: '300px' },
        },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: '100%' }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationSnackbar

