'use client'

import * as React from 'react'

import { Button } from '@/components'
import { useAppSelector, useBoundActions } from '@/hooks'

/* ========================================================================
                              ReduxCounter                              
======================================================================== */

export const ReduxCounter = () => {
  const { increment, decrement, reset /* , getRandom */ } = useBoundActions()

  // ❌  'state' is of type 'unknown'
  // const value = useSelector((state) => state.counter.value)

  // This will work, but it's an anti-pattern. It will cause unnecessary rerenders.
  // ❌ const { value } = useAppSelector((state) => state.counter)
  const value = useAppSelector((state) => state.counter.value)

  /* ======================
         useEffect
  ====================== */
  // Test to see if getRandom types are correctly
  // inferred with/without the .unwrap() method.

  // React.useEffect(() => {
  //   getRandom()
  //     .unwrap()
  //     .then((result) => {
  //       console.log('\n getRandom().unwrap().then(result):', result)
  //       return result
  //     })
  //     .catch((err) => err)
  // }, [getRandom])

  /* ======================
          return
  ====================== */

  return (
    <section>
      <div className='mb-4 flex justify-center gap-2' role='group'>
        <Button
          onClick={() => decrement(10)}
          size='sm'
          style={{ minWidth: 100 }}
        >
          Decrement
        </Button>
        <Button onClick={() => reset()} size='sm' style={{ minWidth: 100 }}>
          Reset
        </Button>
        <Button
          onClick={() => increment(10)}
          size='sm'
          style={{ minWidth: 100 }}
        >
          Increment
        </Button>
      </div>

      <div className='text-primary text-center text-4xl font-bold'>{value}</div>
    </section>
  )
}
