import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";
import { logout } from "../auth/authSlice";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.fetchUsersService();
      return data;
    } catch (error) {
      // console.error("Error fetching users:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.fetchCurrentUserService();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch current user",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUserService(id);
      return id; // Return the id to remove from the state
    } catch (error) {
      // console.error("Error deleting user:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to delete user");
    }
  },
);

export const updateUserInfo = createAsyncThunk(
  "users/updateUserInfo",
  async ({ id, userInfo }, { rejectWithValue }) => {
    try {
      const data = await userService.updateUserInfo(id, userInfo);
      return data;
    } catch (error) {
      // console.error("Error updating user info:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "Failed to update user info",
      );
    }
  },
);

export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const data = await userService.updateUserRoleService(id, role);
      // console.log(data);
      return data; // Return the updated user
    } catch (error) {
      // console.error("Error updating user role:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "Failed to update user role",
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    currentUser: null,
    loading: {
      fetchUsers: false,
      fetchCurrentUser: false,
      delete: false,
      updateUserInfo: false,
      updateUserRole: false,
    },
    error: {
      fetchUsers: null,
      fetchCurrentUser: null,
      delete: null,
      updateUserInfo: null,
      updateUserRole: null,
    },
    // Temp state for rollbacks
    pendingDelete: null, // Store user being deleted
    pendingUpdate: null, // Store old user for update rollbacks
  },
  reducers: {
    clearError: (state) => {
      state.error = {
        fetchUsers: null,
        fetchCurrentUser: null,
        delete: null,
        updateUserInfo: null,
        updateUserRole: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading.fetchUsers = true;
        state.error.fetchUsers = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading.fetchUsers = false;
        state.error.fetchUsers = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading.fetchUsers = false;
        state.error.fetchUsers = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading.fetchCurrentUser = true;
        state.error.fetchCurrentUser = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading.fetchCurrentUser = false;
        state.error.fetchCurrentUser = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading.fetchCurrentUser = false;
        state.error.fetchCurrentUser = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
        // Store the user for potential rollback - maybe remove
        state.pendingDelete = state.list.find(
          (user) => user._id === action.meta.arg,
        );
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        // Optimistic update: already filtered in pending
        state.loading.delete = false;
        state.error.delete = null;
        state.pendingDelete = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        // Rollback: Add back the deleted user - maybe remove
        if (state.pendingDelete) {
          state.list.push(state.pendingDelete);
        }
        state.loading.delete = false;
        state.error.delete = action.payload;
        state.pendingDelete = null;
      })
      .addCase(updateUserRole.pending, (state) => {
        state.loading.updateUserRole = true;
        state.error.updateUserRole = null;
        // Store the old user for rollback - maybe remove
        state.pendingUpdate = state.list.find(
          (user) => user._id === action.meta.arg.id,
        );
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (user) => user._id === action.payload._id,
        );
        if (index !== -1) {
          state.list[index] = action.payload; // Optimistic update
        }
        state.loading.updateUserRole = false;
        state.error.updateUserRole = null;
        state.pendingUpdate = null;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        // Rollback: Revert to old user
        if (state.pendingUpdate) {
          const index = state.list.findIndex(
            (user) => user._id === state.pendingUpdate._id,
          );
          if (index !== -1) {
            state.list[index] = state.pendingUpdate;
          }
        }
        state.loading.updateUserRole = false;
        state.error.updateUserRole = action.payload;
        state.pendingUpdate = null;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading.updateUserInfo = true;
        state.error.updateUserInfo = null;
        // Store the old user for rollback
        state.pendingUpdate = state.list.find(
          (user) => user._id === action.meta.arg.id,
        );
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (user) => user._id === action.payload._id,
        );
        if (index !== -1) {
          state.list[index] = action.payload; // Optimistic update
        }
        if (state.currentUser && state.currentUser._id === action.payload._id) {
          state.currentUser = action.payload;
        }
        state.loading.updateUserInfo = false;
        state.error.updateUserInfo = null;
        state.pendingUpdate = null;
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        // Rollback: Revert to old user
        if (state.pendingUpdate) {
          const index = state.list.findIndex(
            (user) => user._id === state.pendingUpdate._id,
          );
          if (index !== -1) {
            state.list[index] = state.pendingUpdate;
          }
        }
        state.loading.updateUserInfo = false;
        state.error.updateUserInfo = action.payload;
        state.pendingUpdate = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.list = [];
      });
  },
});
export const { clearError } = userSlice.actions;
export default userSlice.reducer;
