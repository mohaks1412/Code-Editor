import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    leftActiveTab: "Question",
    rightActiveTab: "Code"
};

const tabSlice = createSlice({
    name:"tabs",
    initialState,
    reducers:{
        setLeftActiveTab : (state, action)=>{
            state.leftActiveTab = action.payload;
        },

        setRightActiveTab: (state, action) => {
            state.rightActiveTab = action.payload;
        }
    }
})

export const {setLeftActiveTab, setRightActiveTab} = tabSlice.actions;
export default tabSlice.reducer;