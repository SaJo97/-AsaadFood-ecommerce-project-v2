import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";  
import orderService from "./orderService";

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const data = await orderService.createOrderService(orderData);
      // Fetch orders again after creating new order
      // dispatch(fetchOrders());
      return data;
    } catch (error) {
      // console.error("Order creation error:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : "Order creation failed");
    }
  }
);

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderService.fetchOrderService();
      // console.log("API response fetchOrders:", data);
      return data;
    } catch (error) {
      // console.error("Fetch orders error:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : "Fetch orders failed");
    }
  }
);

// Async thunk for fetching order details by id
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await orderService.fetchOrderByIdService(orderId);
      // console.log("API response fetchOrderById:", data);
      return data;
    } catch (error) {
      // console.error("Fetch order by ID error:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : "Fetch order failed");
    }
  }
);

// Create the order slice
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    currentOrder: null,
    orders: [],
    vismaResponse: null,
    error: {
      create: null,
      fetch: null,
      fetchOne: null,
    },
    loading: {
      create: false,
      fetch: false,
      fetchOne: false,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null; // Clear the error state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order; // Store the created order
        state.orders.unshift(action.payload); // optimistic update
        state.vismaResponse = action.payload.vismaData;
        state.loading.create = false; // Set loading to false
        state.error.create = null; // Clear any previous errors
      })
      .addCase(createOrder.rejected, (state, action) => {
        if (state.orders.length > 0) { // rollback optimistic update - maybe remove later
          state.orders.shift();
        }
        state.error.create = action.payload; // Set error message from the rejected action
        state.loading.create = false; // Set loading to false
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading.fetch = true; // Set loading to true when the request is pending
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload; // Store the fetched orders
        state.error.fetch = null; // Clear any previous errors
        state.loading.fetch = false; // Set loading to false
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error.fetch = action.payload; // Set error message from the rejected action
        state.loading.fetch = false; // Set loading to false
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading.fetchOne = true; // Set loading to true when the request is pending
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload; // Store the fetched order details
        state.error.fetchOne = null; // Clear any previous errors
        state.loading.fetchOne = false; // Set loading to false
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.error.fetchOne = action.payload; // Set error message from the rejected action
        state.loading.fetchOne = false; // Set loading to false
      });
  },
});

// Export the clearError action
export const { clearError } = orderSlice.actions;

// Export the reducer
export default orderSlice.reducer;