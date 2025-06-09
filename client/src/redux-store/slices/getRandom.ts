import { createAsyncThunk } from '@reduxjs/toolkit'
import { /* ResBody, */ ResponsePromise } from '@/types'
import { sleep } from '@/utils'

type Arg = void
type RandomData = { test: string } | null
type GetRandomResponsePromise = ResponsePromise<RandomData>
type GetRandomResolvedResponse = Awaited<GetRandomResponsePromise> // => ResBody<RandomData>

/* ========================================================================
                          
======================================================================== */

export const getRandom = createAsyncThunk<GetRandomResolvedResponse, Arg>(
  'counter/getRandom',
  async (_arg, _thunkAPI): GetRandomResponsePromise => {
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
