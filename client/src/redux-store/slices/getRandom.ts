import { createAsyncThunk } from '@reduxjs/toolkit'
import { ResBody } from '@/types'
import { sleep } from '@/utils'

type Arg = void
type RandomData = { test: string } | null
type GetRandomResponse = ResBody<RandomData>

/* ========================================================================
                          
======================================================================== */

export const getRandom = createAsyncThunk<GetRandomResponse, Arg>(
  'counter/getRandom',
  async (_arg, _thunkAPI) => {
    try {
      await sleep(3000)
      return {
        code: 'OK',
        data: { test: 'Random Data!' },
        message: 'Success',
        success: true
      }
    } catch (_err) {
      return {
        code: 'INTERNAL_SERVER_ERROR',
        data: null,
        message: 'Server Error.',
        success: false
      }
    }
  },
  {}
)
