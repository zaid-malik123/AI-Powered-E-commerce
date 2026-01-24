import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectedProduct: null
}

export const productSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
        state.selectedProduct = action.payload
    }
  },
})

export const { setSelectedProduct } = productSlice.actions

export default productSlice.reducer