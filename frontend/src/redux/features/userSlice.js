import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    loading: false,
    socket: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
        state.user = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload; 
    },
    setSocket: (state, action) => {
      state.socket = action.payload
    }
  },
})

export const { setUser, setSocket, setLoading } = userSlice.actions

export default userSlice.reducer