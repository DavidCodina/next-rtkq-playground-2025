// import * as React from 'react'
import { Page, PageContainer, Title } from '@/components'
import { ContactList, ContactInput } from './components'
//# Look in to persisting redux state across refreshes.

//# Build out optimisic updates.
//# Build out a pagination example.

/* ========================================================================
                                PageContacts
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// To get started go to: https://redux-toolkit.js.org/introduction/getting-started
// To implement into an existing app do this:
//
//   npm install @reduxjs/toolkit  --> "@reduxjs/toolkit": "^1.9.3"
//   npm install react-redux       --> "react-redux": "^8.0.5"
//
// In the original demo I did back in 2021 I got:
//
//    "@reduxjs/toolkit": "^1.6.1",
//    "react-redux": "^7.2.4",
//
// Then we can go to the Quick Start: https://redux-toolkit.js.org/tutorials/quick-start
//
// 1. Create a <root>/src/redux/store.js
// 2. Wrap the <Provider store={store}> around <App />
// 3. Create a <root>/src/redux/slices/
// 4. As an example, inside of the slices/ directory, we have counterSlice.js:
//
//   import { createSlice } from '@reduxjs/toolkit';
//
//   const initialState = { value: 0 }
//
//   export const counterSlice = createSlice({
//     // Name the slice of the Redux store so you can access it in components as follows:
//     // const counter = useSelector((state) => state.counter)
//     name: 'counter',
//     initialState,
//     reducers: {
//       increment: (state, action) => {
//         state.value += action.payload
//       },
//       decrement: (state, action) => {
//         state.value -= action.payload
//       },
//       reset: (state, _action) => {
//         state.value = 0
//       }
//     }
//   })
//
//   export const counterActions = counterSlice.actions
//   export const counterReducer = counterSlice.reducer
//
/////////////////////////
//
// The classed tutorial built in this demo is supplemented with:
//
//  1. Laith Harb's Crash Course: https://www.youtube.com/watch?v=jR4fagDcvrc
//# 2. Udemy's 'React Redux toolkit complete guide 2023'
//
///////////////////////////////////////////////////////////////////////////

const Contacts = () => {
  /* ======================
          return
  ====================== */

  return (
    <Page>
      <PageContainer>
        <Title
          as='h2'
          style={{
            marginBottom: 50,
            textAlign: 'center'
          }}
        >
          Contacts
        </Title>

        <section className='mx-auto' style={{ maxWidth: 500 }}>
          <ContactInput />

          <ContactList />
        </section>
      </PageContainer>
    </Page>
  )
}

export default Contacts
