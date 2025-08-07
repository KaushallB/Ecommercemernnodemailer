import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
};

//Register
export const registerUser = createAsyncThunk('/auth/register',
    async(formData,{rejectWithValue})=>{
    try{
        const response=await axios.post('http://localhost:5000/api/auth/register',formData,{
            withCredentials: true,
        });

        return response.data;
    } catch(err){
        return rejectWithValue(err.response?.data);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {},
    },
    extraReducers: (builder) => {
        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });

        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action);
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success ? true : false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });


        // Check Auth
        builder
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success ? true : false;
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });

        // Logout
        builder
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    }
});


//login
export const loginUser = createAsyncThunk('/auth/login',
    async(formData,{rejectWithValue})=>{
    try{
        const response=await axios.post('http://localhost:5000/api/auth/login',formData,{
            withCredentials: true,
        });

        return response.data;
    } catch(err){
        return rejectWithValue(err.response?.data);
        }
    }
);

//logout
export const logoutUser = createAsyncThunk('/auth/logout',
    async(_,{rejectWithValue})=>{
    try{
        const response=await axios.post('http://localhost:5000/api/auth/logout',{},{
            withCredentials: true,
        });

        return response.data;
    } catch(err){
        return rejectWithValue(err.response?.data);
        }
    }
);

export const checkAuth = createAsyncThunk('/auth/checkauth',
    async()=>{
    const response=await axios.get('http://localhost:5000/api/auth/check-auth',{
             withCredentials: true,
             headers:{
             'Cache-Control': 'no-cache,no-store,must-revalidate,proxy-revalidate',
             Expires:'0'
            }
        }
    );

        return response.data;
}
);



export const { setUser } = authSlice.actions;
export default authSlice.reducer;