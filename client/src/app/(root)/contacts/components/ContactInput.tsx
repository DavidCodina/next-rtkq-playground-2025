'use client'

import { useState, useEffect } from 'react'
import { useAddContactMutation } from '@/redux-store'
import { Button, Input } from '@/components'

/* ========================================================================
                              ContactInput
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: In one of the Dave Gray tutorial's at 13:45
// https://www.youtube.com/watch?v=hI-VgEaCMyQ&list=PL0Zuz27SZ-6M1J5I1w2-uZx36Qp6qhjKo&index=4
// He did: import { nanoid } from '@reduxjs/toolkit'
// This function is used to help generate a random id.
// However, I don't need it here.
//
///////////////////////////////////////////////////////////////////////////

export const ContactInput = () => {
  /* ======================
        addContact()
  ====================== */
  // https://redux-toolkit.js.org/rtk-query/usage/mutation
  // onSuccess / onError callbacks have been intentionally omitted from RTK Query.
  // https://github.com/reduxjs/redux-toolkit/issues/1383

  const [addContact, result] = useAddContactMutation()
  const {
    // data,
    isSuccess,
    isError,
    // error,
    isLoading: addingContact,
    reset
  } = result

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Presumably, we'd want to reset isLoading, isError, isSuccess, error, etc.
    // prior to invoking the addContact() mutation.
    reset()

    // Validiation...
    //# Trigger a toast notification
    if (name === '' || phone === '') {
      return
    }

    const requestData = { name, phone }

    addContact(requestData)
    ///////////////////////////////////////////////////////////////////////////
    //
    // Or prepend .unwrap() if you want to interact with the response data directly.
    // .unwrap()
    // .then((res) => {
    //   console.log(res) // =>  {name: 'Fred', phone: '555-555-5555', id: 1}
    //   return res
    // })
    // .catch((err: any) => { console.log(err) })
    //
    // In this case, the .catch() block WILL potentially run, which would allow use to
    // respond to status codes, etc.
    //
    ///////////////////////////////////////////////////////////////////////////

    // .then((result) => {
    //   // console.log(result) // => { data: {name: 'Fred', phone: '555-555-5555', id: 1} } | { error: ... }

    //   if ('error' in result) {
    //     // If there's an error we COULD handle it here.
    //     // However, the real way to do it is in an:
    //     // if (isError) { ... } check above
    //     // console.log('error: ', result.error)
    //   }

    //   if ('data' in result) {
    //     ///////////////////////////////////////////////////////////////////////////
    //     //
    //     // If we did not have invalidatesTags: ['Contacts'] in the getContacts() api function,
    //     // then we could potentially do a manual refetch here. In order to make this happen,
    //     // we'd do this:
    //     //
    //     //   1. import { useGetContactsQuery } from 'store'
    //     //   2. const { refetch: refetchContacts } = useGetContactsQuery()
    //     //   3. Then here do: refetchContacts()
    //     //
    //     ///////////////////////////////////////////////////////////////////////////
    //   }

    //   return result
    // })
    // .catch((err) => err)
  }

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // In this case, we don't SEEM to need implement a useEffect(). Why?
  // Because the useAddContactMutation runs after the user has submitted
  // the data. That said, there could still be a potential conflict if state
  // in the parent component is changing at the exact same time. For that reason,
  // it's best to always put this kind of thing in a useEffect.()
  //
  // An equally valid approach would be to handle this in the addContact(requestData).then( ... )
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (isSuccess) {
      setName('')
      setPhone('')
      reset()
    } else if (isError) {
      //# Error: use react toast...
    }
  }, [isError, isSuccess, reset])

  /* ======================
          return
  ====================== */

  return (
    <form
      className='bg-background-light mb-6 space-y-4 rounded-lg border p-4'
      onSubmit={(e) => {
        e.preventDefault()
      }}
      noValidate
    >
      <Input
        // disabled={addingContact}
        label='Name'
        labelRequired
        onChange={(e) => {
          setName(e.target.value)
        }}
        fieldSize='sm'
        placeholder='Name...'
        value={name}
      />

      <Input
        // disabled={addingContact}
        label='Phone'
        labelRequired
        onChange={(e) => {
          setPhone(e.target.value)
        }}
        placeholder='Phone...'
        value={phone}
      />

      <Button
        className='flex w-full'
        loading={addingContact}
        onClick={handleSubmit}
        size='sm'
        type='button'
        variant='success'
      >
        Create Contact
      </Button>
    </form>
  )
}
