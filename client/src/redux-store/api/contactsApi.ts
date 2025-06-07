import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { createSelector } from '@reduxjs/toolkit'

import { sleep } from '@/utils'
import { Contact } from '@/types'
import { RootState } from '@/redux-store'

// If you import from '@/redux-store' here, Next.js gets confused.
// It may be creating a circular dependency.
import { api } from './api'

/* ========================================================================
        contactsApi (i.e., extended API slice / contacts API  slice)
======================================================================== */
// Injecting Endpoints: https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced
// Dave Gray creates extended slices here at 5:00:
// https://www.youtube.com/watch?v=9P2IUx13MZI&list=PL0Zuz27SZ-6M1J5I1w2-uZx36Qp6qhjKo&index=9
//
// Notice that unlike SWR, React Query, etc. RTK Query forces you to define your
// API logic here, rather than creating separate async functions that are passed in
// during consumption.

export const contactsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    ///////////////////////////////////////////////////////////////////////////
    //
    // When using Typescript, it's important to pass in types for builder.query<???, ???>.
    // Otherwise, you get weird errors when consuming.
    //
    // In the following <IContact[], void>, IContact[] represents the result type.
    // void is for the argument type. In other words, void indicates to Typescript
    // that getContacts() takes no args when being consumed.
    //
    // When consuming the associated useGetContactsQuery(), we can do this.
    //
    //   const { data } = useGetContactsQuery()
    //
    // Because we typed builder.query<IContact[], void> below,
    // Typescript knows that data is either IContact[] | undefined.
    // Thus if you tried to do this, you'd get an error:
    //
    // if (data) { console.log(data[0].age) } // => Property 'age' does not exist on type 'IContact'.
    //
    ///////////////////////////////////////////////////////////////////////////
    getContacts: builder.query<Contact[], void>({
      // ⚠️ queryFn() seems useful if you need to add custom async logic.
      // It's also useful if you need to make a custom fetch (i.e., without using baseQuery).
      // https://redux-toolkit.js.org/rtk-query/usage/customizing-queries

      // async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
      //   await sleep(5000)

      //   try {
      //     const result = await baseQuery({
      //       url: '/contacts'
      //     })

      //     if (result.error) {
      //       return { error: result.error }
      //     }

      //     return {
      //       data: result.data as Contact[]
      //     }
      //   } catch (err) {
      //     const fetchBaseQueryError: FetchBaseQueryError = {
      //       status: 'FETCH_ERROR',
      //       error: err instanceof Error ? err.message : 'Internal Server Error.'
      //     }
      //     return {
      //       error: fetchBaseQueryError
      //     }
      //   }
      // },

      query: () => {
        ///////////////////////////////////////////////////////////////////////////
        //
        // Regarding the return type:
        //
        // For simple responses you can do this:
        //
        //   return '/contacts'
        //
        // Otherwise, we can use an object.
        // Internally, this seems to be typed as: FetchArgs:
        //
        //   https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#individual-query-options
        //
        //   interface FetchArgs extends RequestInit {
        //     url: string
        //     params?: Record<string, any>
        //     body?: any
        //     responseHandler?:
        //       | 'json'
        //       | 'text'
        //       | `content-type`
        //       | ((response: Response) => Promise<any>)
        //     validateStatus?: (response: Response, body: any) => boolean
        //     timeout?: number
        //   }
        //
        // In the following egghead tutorial:
        // https://egghead.io/lessons/redux-refactor-basequery-to-use-rtk-query-fetchbasequery
        // The guy also indicated that we could pass ANYTHING that would qualify as normal
        // fetch() request options: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
        // For example:
        //
        //  - headers: {}
        //  - credentials: "same-origin"
        //  - etc.
        //
        // In fact, I've also seen the type of the return value referenced as: string | Record<string, unknown>
        // https://redux-toolkit.js.org/rtk-query/api/createApi#query
        // In practice, we get no warning from Typescript if we pass in extra properties.
        // However, if we pass in a known property with a bad value, we will get a red squiggly
        // on the above 'query' key (not in the actual return object):
        //
        //   return {
        //     url: '/contacts',
        //     headers: { 'x-custom-header': 123 } // => Typescript will complain because a header value must be  string | undefined
        //   }
        //
        // Note: If you pass in a full url (starting with http:// or https://) fetchBaseQuery will skip baseUrl and use the supplied url instead.
        // Thus, if you ever wanted to access resources outside of your primary server,
        // you could do something like the following:
        // return 'https://jsonplaceholder.typicode.com/users'
        //
        ///////////////////////////////////////////////////////////////////////////
        return {
          // ⚠️ I've seen Lenz Weber-Tronic put a trailing slash on the baseQuery.baseUrl in api.ts..
          // However, it seems more intuitive to prepend the slash for each url here instead.
          // Whichever apporach you choose, it's important to be consistent.

          url: '/contacts',
          // https://egghead.io/lessons/redux-customize-query-and-mutation-headers-in-rtk-query-with-prepareheaders
          // This will add it specifically to THIS query.
          // In the Network Tab we will see: x-local-header: 'This header is applied to the specific request!'
          // Note: that creating local headers here will COMPLETELY replace any global headers defined within
          // baseQuery above! In order to get both local and global headers, we use the prepareHeaders option
          // from within baseQuery above.
          headers: {
            'x-local-header': 'This header is applied to the specific request!'
          }
        }
      },

      ///////////////////////////////////////////////////////////////////////////
      //
      // There are different examples in the Redux docs for how to correctly generate tags.
      // They often have slight variations.
      // This one was taken from the example found here:
      //
      //   https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#selectively-invalidating-lists
      //
      // The id: 'LIST' part is an arbitrary specifier used to prevent individual contacts from
      // also being refetched when it's invalidted in addContact() below.
      // Thid poiny id first mentioned in the docs here:
      //
      //   https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#invalidating-specific-items
      //   There is one caveat here. By specifying a plain 'Contacts' tag in getContacts and invalidating it in addContact,
      //   we actually end up forcing a refetch of all individual contacts as well. If we really want to just
      //   refetch the list of contacts... you can include an additional tag with
      //   an arbitrary ID, like {type: 'Contacts', id: 'LIST'}.
      //
      // Should we map ids? In some examples you see this kind of thing:
      //
      //   providesTags: (result /* , error, arg */) => {
      //     return result ? [{ type: 'Contacts', id: 'LIST' }, ...result.map((item) => {
      //       return { type: 'Contacts' as const, id: item.id }
      //     })] : [{ type: 'Contacts', id: 'LIST' }]
      //   },
      //
      // Here, we're generating individual tags for each contact item. We're not actually caching
      // the data under that tag, so why do this? The benefit of doing this is if you have a mutation
      // like updateContact(). In that case, it will take the response body from a successful call
      // to updateContact and inject it into the contacts cache. This is a feature called
      // "automatic cache updates" in RTK Query. Then in the updateContact mutation we would only
      // need to invalidate the individual cache for the specific contact item, and NOT invalidate
      // the entire LIST.
      //
      //   [{ type: 'Contacts', id: originalArgument.id }]
      //
      // ⚠️ Note: This strategy is ONLY effective if updateContact() is returning a response body with
      // data that has the EXACT shape of a Contact. However, generally I return { code, data, message, success }.
      // Consequently, I would need to use transformResponse to get the correct shape. However, I often prefer
      // to store the entire response body in the cache. For this reason, I'm not a fan of using the
      // mapping optimization at all. It's too fancy for my taste.
      //
      ///////////////////////////////////////////////////////////////////////////

      providesTags: [{ type: 'Contacts', id: 'LIST' }]

      ///////////////////////////////////////////////////////////////////////////
      //
      // Transform the response data, so that newer contacts come first.
      // This function doesn't run if the query gets an error.
      // That being the case, it's technically not necessary to do the array check.
      //
      // Also, I think transformResponse only works in conjunction with the standard query method.
      // This would make sense since if you're using queryFn(), then you can perform the
      // transform operations directly within that function body.
      //
      // If you don't want the transformed data to be the cached but do want a set of
      // transformed data that is reusable across different parts of the application, then
      // create a custom selector with createSelector() instead.
      //
      // See here for another example:
      // https://egghead.io/lessons/redux-transforming-rtk-query-data-before-caching-with-transformresponse
      //
      ///////////////////////////////////////////////////////////////////////////

      // ⚠️ Gotcha: This is not available in conjunction with queryFn().
      // In that case, queryFn, takes full control of the query process, including any
      // transformations we want to do to the response. This means that we'd need to move
      // the transformation logic into the queryFn().

      // transformResponse: (response: Contact[], _meta, _arg) => {
      //   // transformResponse could also be used to pick out the actual data from the full
      //   // response body of { code, data, message, success }. One could aregue that toring
      //   // the entire response body in the cache may expose details that we don't necessarily
      //   // want the end user to see. That said, if they're smart enough to inspect Redux devtools,
      //   // they're smart enough to inspect the Network tab. Generally, I prefer to store the entire
      //   // response body, so I can access `code`,`message`, etc.
      //   if (Array.isArray(response)) {
      //     return response.sort((a, b) => {
      //       return b.id - a.id
      //     })
      //   }
      //   return response
      // }

      ///////////////////////////////////////////////////////////////////////////
      //
      // If you wan to test the isLoading flag, you can use a queryFn() instead of query:
      //
      // async queryFn(arg, queryApi, extraOptions, baseQuery) {
      //   const sleep = async (duration: number) =>
      //     await new Promise((resolve) => setTimeout(resolve, duration))
      //
      //   await sleep(3000)
      //
      //   // Simple solution for typing the result:
      //   // https://redux-toolkit.js.org/rtk-query/usage-with-typescript#typing-a-queryfn
      //   const result = await baseQuery('/contacts')
      //
      //   // type ResultType = typeof result
      //   // Typescript is smart enough to determine that if result.error, then
      //   // the return value will be the error object from the ResultType union.
      //   if (result.error) {
      //     return result
      //   }
      //
      //   return result as { data: IContact[] }
      // }
      //
      ///////////////////////////////////////////////////////////////////////////
    }),

    getContact: builder.query<Contact, number>({
      query: (id) => `/contacts/${id}`,

      // queryFn: async (id, _baseQueryApi, _extraOptions, baseQuery) => {
      //   await sleep(3000)

      //   try {
      //     const result = await baseQuery({
      //       url: `/contacts/${id}`
      //     })

      //     if (result.error) {
      //       return { error: result.error }
      //     }

      //     return {
      //       data: result.data as Contact
      //     }
      //   } catch (err) {
      //     const fetchBaseQueryError: FetchBaseQueryError = {
      //       status: 'FETCH_ERROR',
      //       error: err instanceof Error ? err.message : 'Internal Server Error.'
      //     }
      //     return {
      //       error: fetchBaseQueryError
      //     }
      //   }
      // },

      // https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#providing-tags
      providesTags: (_result, _error, originalArgument) => {
        // Provide a tag for the cached data. This allows us to later
        // invalidate that cache by tag in the mutation logic.
        return [{ type: 'Contacts', id: originalArgument }]
      }

      // keepUnusedDataFor: 60
    }),

    addContact: builder.mutation<Contact, Omit<Contact, 'id'>>({
      // query: (body) => ({
      //   url: '/contact',
      //   method: 'POST',
      //   // RTK Query automatically handles the JSON stringification of the request body for you!
      //   // It also sets the appropriate Content-Type: application/json header
      //   body
      // }),

      // Alternatively, you can use queryFn() which is more granular. Generally, I don't use this.
      // However, if you want to test a slow query and need custom async behavior, that can
      // only be done with queryFn().
      // https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#implementing-a-queryfn

      queryFn: async (body, _baseQueryApi, _extraOptions, baseQuery) => {
        // const { abort, dispatch,endpoint, extra, forced, getState, queryCacheKey, signal, type } = baseQueryApi
        await sleep(3000)

        try {
          const result = await baseQuery({
            url: '/contacts',
            method: 'POST',
            body
          })

          if (result.error) {
            return { error: result.error } // => result.error is of type FetchBaseQueryError
          }

          return {
            data: result.data as Contact
          }
        } catch (err) {
          // The RTKQ docs provide an example that does this: return { error }.
          // However, that's misleading. It atctually needs to be of type FetchBaseQueryError.
          // Moreover, RTKQ does not magically convert any arbitrary error object into a FetchBaseQueryError
          // when you return it directly from a queryFn. This needs to be done manually.

          const fetchBaseQueryError: FetchBaseQueryError = {
            status: 'FETCH_ERROR',
            error: err instanceof Error ? err.message : 'Internal Server Error.'
          }
          return {
            error: fetchBaseQueryError
          }
        }
      },

      async onQueryStarted(
        queryArgument, // The data passed to the mutation (e.g., { name: 'John Doe', phone: '123-456-7890' })

        mutationLifeCycleApi
      ) {
        const { dispatch, queryFulfilled } = mutationLifeCycleApi
        // Generate a temporary ID for the optimistic entry
        // This is crucial because your Contact type requires an 'id'.
        // In a real application, you might use a UUID library like 'uuid'.
        // Use a negative ID to avoid collision with real IDs
        const tempId = Math.floor(Math.random() * -1000000)

        const optimisticContact: Contact = { id: tempId, ...queryArgument }

        // Optimistically update the 'getContacts' cache
        const patchResult = dispatch(
          contactsApi.util.updateQueryData(
            'getContacts',
            undefined,
            (draft) => {
              draft.push(optimisticContact)
            }
          )
        )

        try {
          // Wait for the actual API call to complete
          const { data: realContact } = await queryFulfilled

          // If the API call is successful, update the optimistic entry with the real data
          dispatch(
            contactsApi.util.updateQueryData(
              'getContacts',
              undefined,
              (draft) => {
                // Find the optimistic entry by its temporary ID and replace it
                const index = draft.findIndex(
                  (contact) => contact.id === tempId
                )
                if (index !== -1) {
                  draft[index] = realContact
                }
              }
            )
          )
        } catch (error) {
          // If the API call fails, revert the optimistic update
          patchResult.undo()
          // Optionally, you might want to show an error message to the user
          console.log('\nFailed to add contact:', error)
        }
      },

      invalidatesTags: [{ type: 'Contacts', id: 'LIST' }]
    }),

    updateContact: builder.mutation<Contact, Contact>({
      query: (body) => ({
        url: `/contacts/${body.id}`,
        method: 'PATCH',
        body
      }),

      // https://redux-toolkit.js.org/rtk-query/usage/automated-refetching#invalidating-tags
      // https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#invalidating-specific-items
      invalidatesTags: (_result, _error, originalArgument) => {
        return [
          { type: 'Contacts', id: 'LIST' },
          { type: 'Contacts', id: originalArgument.id }
        ]
      }
    }),

    // I can't remember what json-server gives you when you delete an item.
    // I think it's just an empty object literal, but for now I just put any.
    // We could use the tranform feature to actually send back something a bit
    // more informative.
    deleteContact: builder.mutation<any, number>({
      query: (id) => ({
        url: `/contacts/${id}`, // Change to `/contactz/${id}` to simulate optimistic update rollback.
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error, originalArgument) => {
        // Invalidate the associated tag + the contacts cache.
        return [
          { type: 'Contacts', id: 'LIST' },
          { type: 'Contacts', id: originalArgument }
        ]
      },

      // Optimistic Update / Manual Cache Update:
      // https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates
      // https://egghead.io/lessons/redux-perform-optimistic-updates-in-rtk-query-by-dispatching-the-updatequerydata-action
      // https://egghead.io/lessons/redux-undo-an-optimistic-update-in-rtk-query-with-queryfulfilled

      async onQueryStarted(id, { dispatch /*, queryFulfilled */ }) {
        const _result = dispatch(
          // Gotcha: When code-splitting with injected endpoints, use the name of the
          // extended API slice here. In other words, use contactsApi.util.updateQueryData
          // and NOT api.util.updateQueryData
          contactsApi.util.updateQueryData(
            'getContacts',
            undefined,
            (contactsDraft) => {
              ///////////////////////////////////////////////////////////////////////////
              //
              // It looks like operations performed can be done so via mutation, without a returning a value.
              // To mutate an item out of an array we can use .splice() : https://doesitmutate.xyz/splice/
              //
              // We COULD use a more modern approach for getting the deleteIndex.
              // https://bobbyhadz.com/blog/javascript-array-find-index-of-object-by-property
              // But this is ES5 compaible:
              //
              // I think this is all connected to Immer, and we can either mutate the draft
              // (i.e., contacts) directly, or return a new value (but not both).
              // Note: contactsDraft will not be the actual contacts array. Rather, if we logged
              // its value, we'd see that it's a Proxy(Array) -whatever that is.
              //
              ///////////////////////////////////////////////////////////////////////////

              const deleteIndex = (() => {
                let index = -1

                if (Array.isArray(contactsDraft)) {
                  for (let i = 0; i < contactsDraft.length; i++) {
                    const item = contactsDraft[i]

                    if (item?.id === id) {
                      index = i
                      break
                    }
                  }
                }
                return index
              })()

              if (deleteIndex >= 0) {
                contactsDraft.splice(deleteIndex, 1)
              }
            }
          )
        )

        // console.log('result: ', result) // => { inversePatches, patches, undo }

        ///////////////////////////////////////////////////////////////////////////
        //
        // Once the optimistic update has completed, we can check that the 'query' (i.e., mutation)
        // was successful. If it was unsuccessful, then we can result.undo()
        // Or just do queryFulfilled.catch(result.undo)
        //
        // Optimistic updates serve 2 purposes:
        //
        //   1. They can potentially replace the need for tags IF
        //   they are used across ALL associated mutations. Generally, I tend not
        //   to use optimistic updates in this way, preferring to always refetch
        //   in the background - it's just better to always rely on the source of truth.
        //
        //   2. Even if we are still using tags, optimistic updates still have the benefit of
        //   immediate UI changes for users with slow a network.
        //
        // Below is the code that one would use for rolling back an optimistic update.
        // However, because we are actually using tags, we don't need it. Ultimately,
        // regardless of whether the mutation succeeds or fails, the associated caches
        // are invalidated.
        //
        ///////////////////////////////////////////////////////////////////////////

        // try {
        //   await queryFulfilled
        // } catch (err) {
        //   // console.log('Error from optimistic update', err)
        //   result.undo()
        //   // Alternatively, on failure you can invalidate the corresponding cache tags
        //   // to trigger a re-fetch:
        //   // dispatch(contactsApi.util.invalidateTags(['Contacts']))
        // }
      }
    })
  })
})

///////////////////////////////////////////////////////////////////////////
//
// This would be consumed in a components as follows:
// import { selectContacts, useTypedSelector } from 'store'
// Note: Here I'm using useTypedSelector, but useSelector from react-redux would
// also work.
//
// Note: If the data hasn't been fetched/cached already, then the result will be:
//
//   {
//     isError:  false
//     isLoading: false
//     isSuccess: false
//     isUninitialized: true
//     status: "uninitialized"
//   }
//
// In a non RTKQ setup (using standard slices), the result would be that resource
// itself, and would deafult to whatever initialState had set it to. In general,
// I think using:
//
//   const { data } = useTypedSelector(selectContacts)
//
// is not a good practice. It's better to just use the use query function. That
// way, if the data is there it will get it from the cache, and if it's not, then
// it will fetch it.
//
///////////////////////////////////////////////////////////////////////////

// Dave Gray defines a similar selector her at 14:00 :
// https://www.youtube.com/watch?v=9P2IUx13MZI&list=PL0Zuz27SZ-6M1J5I1w2-uZx36Qp6qhjKo&index=11
// This will give you the entire result object - not ONLY the data.
// That's why we also define a selectContactsData() below for ONLY the data.
export const selectContacts = contactsApi.endpoints.getContacts.select()

///////////////////////////////////////////////////////////////////////////
//
// Out of the box, the result of .select() is always a memoized selector function.
// For that reason, it's not necessary to use createSelector just to memoize the data
// (as might be necessary if using normal slices). That said, creating a custom selector
// is also used as a transformation apporach (i.e., an alternative to the trasnformResponse
// property):
//
//   https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#transforming-responses
//   https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#comparing-transformation-approaches
//
// Thus if you wanted to pick out the data ahead of time (which I wouldn't advise), you could do something
// like the following.
//
// Usage:
//
//   const data = useTypedSelector(selectContactsData)
//
// It may be useful to implement a custom selector like this (in contrast to transformResponse)
// when need a transformed result in multiple places across your application, but don't want the
// transformed data to be what is cached (i.e., as would be the case with transformResponse property).
// A more realistic use case, would be having a data set that is mapped over or filtered, and this logic
// is used across your app in multiple places. The following example is NOT practical, but shows
// how the pattern is implemented.
//
///////////////////////////////////////////////////////////////////////////

// Usage: const contactsStateFromSelector = useTypedSelector(selectContactsState)
export const selectContactsState = (state: RootState) => {
  return contactsApi.endpoints.getContacts.select()(state)
}

// Usage: const contactsDataFromSelector = useTypedSelector(selectContactsData)
export const selectContactsData = (state: RootState): Contact[] | undefined => {
  return contactsApi.endpoints.getContacts.select()(state).data
}

// Usage: const contactStateFromSelector = useTypedSelector(selectContactState(contactId))
export const selectContactState = (id: number) => {
  return contactsApi.endpoints.getContact.select(id)
}

///////////////////////////////////////////////////////////////////////////
//
// This also works, but is not optimized:
//
//   export const selectContactData = (id: number): ((state: RootState) => Contact | undefined) => {
//     return (state: RootState) => {
//       return contactsApi.endpoints.getContact.select(id)(state).data
//     }
//   }
//
///////////////////////////////////////////////////////////////////////////

// Usage: const contactDataFromSelector = useTypedSelector(selectContactData(contactId))
export const selectContactData = (id: number) =>
  // createSelector is used here to memoize the extraction of `.data`
  // from the result of the RTK Query parameterized selector.
  // This ensures that the returned data is only recalculated when the
  // underlying RTK Query cache data for the specific id actually changes.
  // That said, it's arguable whether or not we need to memoize the extraction of `.data`.
  // Why? Because it's not computationally expensive.
  createSelector(
    contactsApi.endpoints.getContact.select(id), // Input selector (RTK Query's memoized selector)
    (contactResult) => contactResult?.data // Output selector (extracts the data)
  )

// Hooks are auto-generated based on the queries created above.
export const {
  useGetContactsQuery,
  useGetContactQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation
} = contactsApi
