import {configureStore} from "@reduxjs/toolkit"
import userSliceReducer from "./userSlicer"
export  const store=configureStore({
    reducer:{
        user1:userSliceReducer
    }
})