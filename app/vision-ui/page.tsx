'use client'

import React from 'react'
import VuiBox from '../../components/ui-vision/VuiBox'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../../components/ui-vision/theme'
import CssBaseline from '@mui/material/CssBaseline'

export default function VisionUIDemoPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Vision UI Components</h1>
        
        <h2 className="text-xl mb-2">VuiBox Examples</h2>
        
        <VuiBox
          bgColor="primary.main"
          color="white.main"
          opacity={0.8}
          p={2}
          m={2}
          borderRadius="lg"
        >
          This is a Vision UI Box with primary background
        </VuiBox>
        
        <VuiBox
          variant="gradient"
          bgColor="primary"
          p={2}
          m={2}
          borderRadius="md"
        >
          This is a Vision UI Box with gradient
        </VuiBox>
        
        <VuiBox
          bgColor="grey.800"
          color="white.main"
          p={2}
          m={2}
          borderRadius="sm"
        >
          This is a Vision UI Box with grey background
        </VuiBox>
      </div>
    </ThemeProvider>
  )
} 