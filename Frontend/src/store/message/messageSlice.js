import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messageService from "./messageService";

export const sendMessage = createAsyncThunk(
  "message/send",
  async (messageData, thunkAPI) => {
    try {
      return await messageService.sendMessage(messageData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Något gick fel"
      );
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetMessageState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearError: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false; // Clear previous errors
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetMessageState } = messageSlice.actions;
export default messageSlice.reducer;
