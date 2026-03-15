import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const getTotalPrice = (cart) => {
  return cart.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 0),
    0,
  );
};

const getTotalQuantity = (cart) => {
  return cart.reduce((total, item) => total + (item.quantity || 0), 0);
};

export const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, priceType } = action.payload;
      if (!product || !product._id || product.price < 0) return; // Guard clause for invalid payload

      const price =
        priceType === "pallet"
          ? product.price.palletPrice
          : product.price.unitPrice;

      const item = state.cart.find(
        (cartItem) =>
          cartItem.productId === product._id &&
          cartItem.priceType === priceType,
      );

      if (item) {
        item.quantity = Math.max(1, item.quantity + 1); // Ensure quantity stays positive
      } else {
        state.cart.push({
          productId: product._id,
          product,
          priceType,
          price,
          quantity: 1,
        });
      }

      state.totalPrice = getTotalPrice(state.cart);
      state.totalQuantity = getTotalQuantity(state.cart);
    },
    removeOne: (state, action) => {
      const { productId, priceType } = action.payload;
      if (!productId) return;

      const item = state.cart.find(
        (cartItem) =>
          cartItem.productId === productId && cartItem.priceType === priceType,
      );
      if (!item) return;

      if (item.quantity <= 1) {
        state.cart = state.cart.filter(
          (cartItem) =>
            !(
              cartItem.productId === productId &&
              cartItem.priceType === priceType
            ),
        );
      } else {
        item.quantity = Math.max(0, item.quantity - 1); // Prevent negative
      }

      state.totalPrice = getTotalPrice(state.cart);
      state.totalQuantity = getTotalQuantity(state.cart);
    },
    removeItem: (state, action) => {
       const { productId, priceType } = action.payload;
      if (!productId) return;

      state.cart = state.cart.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.priceType === priceType
          ),
      );

      state.totalPrice = getTotalPrice(state.cart);
      state.totalQuantity = getTotalQuantity(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      state.totalPrice = 0; // Direct assignment for efficiency
      state.totalQuantity = 0;
    },
  },
});

export const { addToCart, removeOne, removeItem, clearCart } =
  shoppingCartSlice.actions;

export default shoppingCartSlice.reducer;
