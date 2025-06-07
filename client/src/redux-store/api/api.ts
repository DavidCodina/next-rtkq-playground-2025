import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/* ========================================================================
                                api (i.e., apiSlice)
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// https://github.com/reduxjs/redux-toolkit/issues/1410: "Your application should only have one api."
// https://redux-toolkit.js.org/rtk-query/api/createApi
//
// This file eliminates the need for a redundant contactsSlice.ts file.
// Using RTK Query is essentially a second (almost entirely different)
// system that is baked into Redux Toolkit.
//
///////////////////////////////////////////////////////////////////////////

export const api = createApi({
  ///////////////////////////////////////////////////////////////////////////
  //
  // https://redux-toolkit.js.org/rtk-query/api/createApi
  // Defaults to 60 (this value is in seconds). This is how long RTK Query will keep your data cached for after the last component unsubscribes.
  // https://egghead.io/lessons/redux-invalidate-the-rtk-query-cache-using-keepunuseddatafor
  //
  // keepUnusedDataFor can also be set within each builder.query({ ... }) configuration.
  //
  ///////////////////////////////////////////////////////////////////////////
  keepUnusedDataFor: 60,
  reducerPath: 'api', // If omitted, RTK will default to 'api'.

  // There are other base queries besides fetchBaseQuery:
  // axiosBaseQuery:    https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#axios-basequery
  // graphqlBaseQuery:  https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#graphql-basequery
  baseQuery: fetchBaseQuery({
    // Some examples use '/'.
    // However, our backend is at 'http://localhost:5000',
    // and '/' would likely imply 'http://localhost:3000'
    // We'd probably want to check the environment and either hit a dev server or prod server.
    baseUrl: 'http://localhost:5000',

    // https://egghead.io/lessons/redux-customize-query-and-mutation-headers-in-rtk-query-with-prepareheaders
    // Global headers will be COMPLETELY replaced by any local headers defined by a specific query.
    // In order to implement both global and local header, we need to use the 'prepareHeaders' property.
    prepareHeaders: (headers) => {
      headers.set(
        'x-global-header',
        'This header is applied to all requests (including requests with custom headers)!'
      )

      // Not sure, but in the Learn With Jason tutorial at 1:09:00 Mark Erikson
      // said we need to return headers. Double-check the docs on this now.
      // In fact, this does seem to be the case:
      // https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests
      return headers
    },
    headers: {
      'x-global-header':
        'This header is applied to all requests (unless that request has custom headers)!'
    }
  }),

  ///////////////////////////////////////////////////////////////////////////
  //
  // In the following video, we begin with a custom baseQuery:
  // https://egghead.io/lessons/redux-refactor-rtk-query-endpoints-to-use-basequery-to-remove-code-duplication
  // This is just as an execercise. Normally, you're almost always going to want to implement the provided
  // fetchBaseQuery instead.
  //
  //   baseQuery: async (url) => {
  //     const baseUrl = 'http://localhost:5000'
  //     const result = await fetch(`${baseUrl}${url}`)
  //     if (!result.ok) { return { error: 'Request failed!' } }
  //     const data = await result.json()
  //     return { data }
  //   },
  //
  ///////////////////////////////////////////////////////////////////////////

  // Presumably, this will make everything refetch on focus globally.
  // For a more fine-grained approach, you can turn it on/off in the
  // individual query hooks. In either case, I think you need to configure
  // setupListeners(store.dispatch) in the store file.
  // https://egghead.io/lessons/redux-refetch-data-on-focus-and-reconnect-with-rtk-query-s-setuplisteners
  // ⚠️ Generally, I don't do this because it can lead to unexpected behavior.

  // refetchOnFocus: true,
  // Allows forcing the query to refetch when regaining a network connection. Defaults to false.
  // This also depends on setupListeners(store.dispatch) in the store.ts file.
  refetchOnReconnect: true,

  // https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
  // https://redux-toolkit.js.org/rtk-query/api/createApi#tagtypes
  // Note: Sometimes in the documentation the entity is singular.
  // However, I've also seen official typescript examples where the
  // entity used is plural. I prefer plural.
  tagTypes: ['Contacts'],

  // Using api.injectEndpoints({ ... }) in separate files  to create
  // extended slices rather than bloating this file.
  endpoints: (_builder) => ({})
})
