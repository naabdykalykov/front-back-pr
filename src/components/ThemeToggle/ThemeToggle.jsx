import React from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material'

function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <Tooltip title={isDarkMode ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}>
      <IconButton
        color="inherit"
        onClick={onToggle}
        aria-label={isDarkMode ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
        sx={{ ml: 1 }}
      >
        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle

