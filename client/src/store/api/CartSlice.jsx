import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define any async thunks here if needed

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload._id);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item._id !== action.payload
          );
        }
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle async thunk states here if you have any
  },
});

export const {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;

// src/store/api/CartSlice.js
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   items: [],
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const item = state.items.find((item) => item._id === action.payload._id);
//       if (item) {
//         item.quantity += 1;
//       } else {
//         state.items.push({ ...action.payload, quantity: 1 });
//       }
//     },
//     decreaseQuantity: (state, action) => {
//       const item = state.items.find((item) => item._id === action.payload);
//       if (item) {
//         if (item.quantity > 1) {
//           item.quantity -= 1;
//         } else {
//           state.items = state.items.filter(
//             (item) => item._id !== action.payload
//           );
//         }
//       }
//     },
//     removeFromCart: (state, action) => {
//       state.items = state.items.filter((item) => item._id !== action.payload);
//     },
//   },
// });

// export const { addToCart, decreaseQuantity, removeFromCart } =
//   cartSlice.actions;

// export default cartSlice.reducer;
