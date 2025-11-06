import { createSlice } from "@reduxjs/toolkit";
import { supabase } from "../components/supabase";
export const userSlice=createSlice({
    name:"userId",
    initialState:{
        user:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        }
    }
})
export const {setUser}=userSlice.actions
export default userSlice.reducer