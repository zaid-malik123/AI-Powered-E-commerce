import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  cartTotal: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      // If payload is an array, replace entire cart
      if (Array.isArray(action.payload)) {
        state.cart = action.payload;
      } else {
        // If single item, add or update it
        const newItem = action.payload;
        const existingItem = state.cart.find(
          (item) => item.productId === newItem.productId
        );

        if (!existingItem) {
          state.cart.push(newItem);
        }
      }
    },

    removeCartItem: (state, action) => {
      state.cart = state.cart.filter(
        (item) => item.productId !== action.payload
      );
    },

    clearCart: (state) => {
      state.cart = [];
    },
    setCartTotal: (state, action) => {
      state.cartTotal = action.payload;
    }
  },
});

export const {
  setCart,
  removeCartItem,
  clearCart,
  setCartTotal
} = cartSlice.actions;

export default cartSlice.reducer;