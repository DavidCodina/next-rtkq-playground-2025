'use client'

import { Fragment, useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Button, Input } from '@/components'
import {
  useGetContactQuery,
  useUpdateContactMutation,
  selectContactState,
  selectContactData
} from '@/redux-store'

import { useAppSelector } from '@/hooks'

/* ========================================================================
                              UpdateContactForm
======================================================================== */

export const UpdateContactForm = () => {
  const router = useRouter()
  const params = useParams()
  //! Why am I doing it like this?
  const contactId = typeof params.id === 'string' ? parseFloat(params.id) : -1
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const contactStateFromSelector = useAppSelector(selectContactState(contactId))
  const contactDataFromSelector = useAppSelector(selectContactData(contactId))

  console.log('\n', {
    contactStateFromSelector,
    contactDataFromSelector
  })

  /* ======================
        contactData
  ====================== */
  // Gotcha: This will end up gettting cached by RTK Query.
  // This means that we need to invalidate the cache after
  // we've updated the associated contact.

  const {
    isError: isContactError,
    error: contactError,
    isLoading: contactLoading,
    isSuccess: contactSuccess,
    data: contactData
  } = useGetContactQuery(contactId)

  /* ======================
      updateContact()
  ====================== */

  const [updateContact, result] = useUpdateContactMutation()
  const {
    // data: updateContactData,
    isSuccess: updateContactSuccess,
    // isError: isUpdateContactError,
    // error: updateContactError,
    isLoading: updatingContact,
    reset: resetUpdateContact
  } = result

  /* ======================
        handleSubmit()
  ====================== */

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    // Presumably, we'd want to reset all state associated to updating
    // the contact prior to invoking the updateContact() mutation.
    resetUpdateContact()

    // Validiation...
    //# Trigger a toast notification
    if (name === '' || phone === '') {
      return
    }

    const requestData = { id: contactId, name, phone }

    updateContact(requestData)
      .then((result: any) => {
        // if ('error' in result) {}
        // if ('data' in result) {}
        return result
      })
      .catch((err: any) => err)
  }

  /* ======================
        useEffect()
  ====================== */
  // Set form state once contact data is available.
  // This needs to be done inside of a useEffect(). Otherwise, the
  // if block will run every time the user types a new character.

  useEffect(() => {
    if (contactSuccess && contactData) {
      setName(contactData?.name || '')
      setPhone(contactData?.phone || '')
    }
  }, [contactSuccess, contactData])

  /* ======================
        useEffect()
  ====================== */
  ///////////////////////////////////////////////////////////////////////////
  //
  // One the contact data has been update, navigate to '/contacts'.
  // Initially, I tried to do this in the main component body.
  //  However, this creates a Warning:
  //
  //   if (updateContactSuccess) {
  //     navigate('/contacts')
  //   }
  //
  //   - Warning: Cannot update a component (`BrowserRouter`) while rendering
  //   a different component (`UpdateContactForm`).
  //
  // Solution: We need to wait until AFTER this component renders. This can
  // be done with a useEffect().
  //
  ///////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (updateContactSuccess === true) {
      router.push('/contacts')
    }
  }, [router, updateContactSuccess])

  /* ======================
  renderUpdateContactForm()
  ====================== */
  // Only render the form if the associated contact data has been obtained.
  // Otherwise, render the corresponding error or loading UI.

  const renderUpdateContactForm = () => {
    // Appeasing Typescript is a little tricky when picking the error message.
    // This is because the error object can be either a SerializedError or FetchBaseQueryError.
    // https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
    // https://redux-toolkit.js.org/rtk-query/usage-with-typescript#error-result-example
    if (isContactError && contactError) {
      const errorMessage =
        'error' in contactError ? contactError.error : 'Unable to get contact!'
      return <div className='alert alert-red font-bold'>{errorMessage}</div>
    }

    //# Swap this for a Spinner
    if (contactLoading) {
      return <h3 className='text-center font-bold text-blue-500'>Loading...</h3>
    }

    if (contactData && typeof contactData === 'object') {
      return (
        <form
          className='bg-background-light mb-6 space-y-4 rounded-lg border p-4'
          onSubmit={(e) => {
            e.preventDefault()
          }}
          noValidate
        >
          <Input
            // disabled={updatingContact}
            fieldSize='sm'
            label='Name'
            labelRequired
            onChange={(e) => {
              setName(e.target.value)
            }}
            placeholder='Name...'
            value={name}
          />

          <Input
            // disabled={updatingContact}
            fieldSize='sm'
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
            loading={updatingContact}
            onClick={handleSubmit}
            size='sm'
            type='button'
            variant='success'
          >
            Update Contact
          </Button>
        </form>
      )
    }

    return null // Fallback
  }

  /* ======================
          return
  ====================== */

  return <Fragment>{renderUpdateContactForm()}</Fragment>
}
