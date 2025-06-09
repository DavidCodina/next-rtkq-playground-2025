export * from './store'
export * from './api'
export * from './ReduxProvider'

///////////////////////////////////////////////////////////////////////////
//
// https://github.com/reduxjs/redux-toolkit/issues/1566
//
// Gotcha: Initially, I named the parent directory 'redux'
// This ends up causing a namespace conflict:
//
//    import { bindActionCreators } from 'redux' // => Import Error
//
// To fix this specific issue, you COULD do this here:
//
//   import { bindActionCreators } from '../../node_modules/redux'
//
// But then other issues occur as well:
//
//    // Property 'getState' does not exist on type ToolkitStore...
//    export type RootState = ReturnType<typeof store.getState>
//
// This only occurred when switching to a .ts file extension.
// Solution: do NOT name the directory 'redux'.
//
///////////////////////////////////////////////////////////////////////////
