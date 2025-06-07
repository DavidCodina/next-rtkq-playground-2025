'use client'

import { PropsWithChildren } from 'react'
import { ReduxProvider } from '@/redux-store'
import { AppProvider } from './AppContext'
import { NextThemeProvider } from './NextThemeProvider'

export const Providers = ({ children }: PropsWithChildren) => {
  // The order of the providers matters. AppProvider handles any RTK Query prefetching,
  // which means that ReduxProvider needs to be on the outside.
  return (
    <ReduxProvider>
      <AppProvider>
        <NextThemeProvider>{children}</NextThemeProvider>
      </AppProvider>
    </ReduxProvider>
  )
}
