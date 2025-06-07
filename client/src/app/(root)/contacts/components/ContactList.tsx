'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

import { getRTKQueryErrorMessage } from '@/utils'
import { useGetContactsQuery, contactsApi } from '@/redux-store'
import { Alert, Button, Spinner } from '@/components'
import { DeleteButton } from './DeleteButton'

/* ========================================================================
                              ContactList
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Normally, even if I was implementing Redux, I would really only use Redux for
// a few things like user data, or maybe a checkout process. Then I'd use
// something like useSWR() for caching server data. However, if you're implementing
// RTK Query, that means that you'll be using Redux for a lot more server data!
// The potential downside is that now your app is really locked into Redux.
//
///////////////////////////////////////////////////////////////////////////

export const ContactList = () => {
  // const contactsStateFromSelector = useTypedSelector(selectContactsState)
  // const contactsDataFromSelector = useTypedSelector(selectContactsData)
  // console.log('\n', { contactsStateFromSelector, contactsDataFromSelector})

  const router = useRouter()
  const prefetchContact = contactsApi.usePrefetch('getContact')

  const {
    data: contacts,
    error,
    isError,
    isLoading,
    isFetching,
    // isSuccess,
    refetch
  } = useGetContactsQuery(undefined, {
    // pollingInterval defaults to 0, 0 === off. This is NOT dependent on
    // implementing setupListeners(store.dispatch)
    // pollingInterval: 1000 * 5
    //
    // Defaults to false, unless the api slice is set to refetchOnFocus: true.
    // Currently, I think the api does set it to true.
    // This is dependent on implementing setupListeners(store.dispatch)
    // refetchOnFocus: true
  })

  /* ======================
    renderContactList()
  ====================== */

  const renderContactList = () => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Appeasing Typescript is a little tricky when picking the error message.
    // This is because the error object can be either a SerializedError or FetchBaseQueryError.
    // https://redux-toolkit.js.org/rtk-query/usage-with-typescript#type-safe-error-handling
    // https://redux-toolkit.js.org/rtk-query/usage-with-typescript#error-result-example
    //
    ///////////////////////////////////////////////////////////////////////////
    if (isError && error) {
      const errorMessage = getRTKQueryErrorMessage(error)

      return (
        <Alert
          className='mb-auto max-w-[800px] shadow'
          leftSection={<AlertCircle />}
          rightSection={
            <Button
              className='self-center'
              onClick={() => {
                refetch()
              }}
              size='xs'
              title='Get Quiz Categories'
              variant='destructive'
            >
              Try Again
            </Button>
          }
          title='Error'
          variant='destructive'
        >
          {errorMessage}
        </Alert>
      )
    }

    if (isLoading) {
      return <Spinner className='mx-auto block border-[2px]' size={50} />
    }

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return (
        <h3 className='text-center font-bold text-blue-500'>
          You have no contacts!
        </h3>
      )
    }

    // Or just use isSuccess
    if (Array.isArray(contacts)) {
      return contacts.map((contact) => (
        <div
          key={contact.id}
          className='bg-background-light mb-4 flex gap-4 rounded-lg border p-2'
        >
          <img
            alt='headshot'
            src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
            className='border-primary rounded-lg border'
            style={{ display: 'block', maxWidth: 50 }}
          />

          <div className='relative flex-1'>
            <div className='flex items-center gap-2'>
              {/* User Icon */}
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 16 16'
              >
                <path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
                <path
                  fillRule='evenodd'
                  d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z'
                />
              </svg>

              <p>
                {contact.name} (id:{' '}
                {typeof contact.id === 'number' && contact.id < 0
                  ? 'Pending...'
                  : contact.id}
                )
              </p>
            </div>

            <div className='flex items-center gap-2'>
              {/* Phone Icon */}
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 16 16'
              >
                <path d='M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z' />
              </svg>

              <p>{contact.phone}</p>
            </div>

            <div className='absolute top-0 right-0 flex gap-2'>
              <Button
                onClick={() => {
                  router.push(`/contacts/${contact.id}/update`)
                }}
                onMouseEnter={() => {
                  // https://egghead.io/lessons/redux-prefetch-data-in-response-to-user-interactivity-with-rtk-query-s-useprefetch-hook
                  // The prefetch function will always return undefined.
                  // It will work, but it won't give you back a response/Promise
                  prefetchContact(contact.id)
                }}
                size='sm'
                title='Edit Contact'
                variant='primary'
              >
                {/* Pencil Icon (Edit) */}
                <svg
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 16 16'
                >
                  <path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z' />
                </svg>
              </Button>

              {/* It's important that this is a separate component, so that
              loading state only applies to the specific instance. */}
              <DeleteButton contactId={contact.id} />
            </div>
          </div>
        </div>
      ))
    }

    // i.e., isUninitialized
    return null
  }

  /* ======================
          return
  ====================== */

  return (
    <>
      <div className='fixed top-4 right-4 font-medium'>
        isFetching:{' '}
        {isFetching ? (
          <span className='text-success'>true</span>
        ) : (
          <span className='text-destructive'>false</span>
        )}
      </div>
      {renderContactList()}
    </>
  )
}
