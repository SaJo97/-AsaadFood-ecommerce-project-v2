import { configureStore } from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import productReducer from "./products/productSlice";
import authReducer from "./auth/authSlice"
import { shoppingCartSlice } from "./cart/shoppingCartSlice";
import orderReducer from "./order/orderSlice";
import userReducer from "./user/userSlice";
import messageReducer from "./message/messageSlice"

const persistConfig = {
  key: 'root',
  storage
}
const cartPersistConfig = {// refresh keep stuff
  key: "cart",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer)


export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    productList: productReducer,
    shoppingCart: persistReducer(cartPersistConfig, shoppingCartSlice.reducer),
    order: orderReducer,
    users: userReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)