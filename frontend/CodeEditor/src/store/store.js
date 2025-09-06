import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import tabReducer from "./tabSlice"
import codeReducer from "./codeSlice"
import FileReducer from './FileSystemSlice'
import AudioReducer from './audioSlice'
import userReducer from './userSlice'

export const store = configureStore({
        reducer : {
            auth : authReducer,
            tabs : tabReducer,
            code : codeReducer,
            fileSystem: FileReducer,
            audio : AudioReducer,
            user : userReducer,
        }
    }
)

export default store;