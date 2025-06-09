import {
  createSlice,
  PayloadAction
  // createReducer
  // createAction
} from '@reduxjs/toolkit'

import { getRandom } from './getRandom'

type Value = number

// Sometimes, this is called InitialState.
// Don't do that because it shows up as InitialState everywhere when consumed.
// ❌ interface InitialState { value: Value }
export type CounterState = {
  value: Value
}

const initialState: CounterState = { value: 0 }

/* ======================
      counterSlice
====================== */

export const counterSlice = createSlice({
  name: 'counter',
  initialState,

  ///////////////////////////////////////////////////////////////////////////
  //
  // It's weird to call increment, decrement, and reset reducers.
  // However, in the simplest sense a reducer is this: (prevState, action) => newState
  // With that in mind, each function is essentially a mini-reducer that handles a single action.
  // In contrast, in classic Redux we usually have a single reducer that handles ALL actions
  //
  //   const initialState = { count: 0 };
  //
  //   const counterReducer = (state = initialState, action) => {
  //     switch (action.type) {
  //       case 'INCREMENT_COUNT': return { ...state, count: state.count + 1 };
  //       case 'DECREMENT_COUNT': return { ...state, count: state.count - 1 };
  //       case 'RESET_COUNT':     return { ...state, count: 0 };
  //       default:                return state;
  //     }
  //   }
  //
  ///////////////////////////////////////////////////////////////////////////
  reducers: {
    increment: (state, action: PayloadAction<Value>) => {
      ///////////////////////////////////////////////////////////////////////////
      //
      // In classic Redux an action is a plain object.
      // It must have a type property. It may also have a payload property.
      // For example: { type: 'INCREMENT', payload: 10 }
      // We used to have to create our action types manually.
      // Additionally, we generally didn't dispatch the action directly.
      // Instead, we would call dispatch(), passing in an action creator function.
      // This made the action creator function the single source of truth for the action.
      //
      //    See Codevolution at 11:00 : https://www.youtube.com/watch?v=WDJ2eidE-b0&list=PLC3y8-rFHvwiaOAuTtVXittwybYIorRB3&index=7
      //    ❌ dispatch({ type: 'INCREMENT', payload: 10 })
      //    ✅ dispatch(increment(10))
      //
      // In any case, Redux Toolkit now generates the actions for us.
      // The action.type is derived as follows: <sliceName>/<functionName>
      // Consequently, they don't use all uppercase letters.
      // For example, the action here is: {type: 'counter/increment', payload: 10}
      //
      ///////////////////////////////////////////////////////////////////////////

      // In classic Redux, we don't directly mutate the state.
      // However, Redux Toolkit uses immer under the hood.
      // https://www.youtube.com/watch?v=kgCjXjJkZ-Y&list=PLC3y8-rFHvwiaOAuTtVXittwybYIorRB3&index=13
      state.value += action.payload
    },
    decrement: (state, action: PayloadAction<Value>) => {
      state.value -= action.payload
    },

    // ⚠️ Gotcha: If you leave `action` in the parameters, then
    // Typescript will expect 1 argument when consuming reset().
    reset: (state /*, action */) => {
      state.value = 0
    }
  },

  // https://www.youtube.com/watch?v=NBbvaF3GK9U&list=PLC3y8-rFHvwiaOAuTtVXittwybYIorRB3&index=23
  // There are two different syntaxes for extraReducers. From what I've heard the build syntax is preferred.
  // extraReducers: { [actionType]: (state, action) => {} }
  // extraReducers: (builder) => {}

  extraReducers: (builder) => {
    builder
      /* ======================
              getRandom()
      ====================== */

      .addCase(getRandom.pending, (_state, _action) => {})
      .addCase(getRandom.fulfilled, (state, action) => {
        // const { data, success, message } = action.payload
        console.log('\ngetRandom.fulfilled response:', action.payload)
      })
  }
})

// counterSlice will automatically generate action creators that have the
// same names as the reducer functions. The fact, that they are under counterSlice.actions
// is a little misleading because they're not actions. They're action creators.
export const counterActions = counterSlice.actions
export const counterReducer = counterSlice.reducer

export const counterThunks = {
  getRandom
}
