import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("Registering with data", userData);
      const data = await authService.registerUser(userData);
      // console.log("Registration successful", data);
      // Removed token storage—backend sets httpOnly cookie
      return {
        message: "Registration successful",
        email: userData.loginEmail,
        role: data.user.role, 
        // token: data.token,
      };
    } catch (error) {
      // console.error("Registration error:", error.response?.data || error.message);
      if (error.response?.data?.errors) {
        // Map the array to a simple object: { field: msg }
        const fieldErrors = error.response.data.errors.reduce((acc, e) => {
          acc[e.param] = e.msg;
          return acc;
        }, {});
        return rejectWithValue(fieldErrors);
      }
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Registrering misslyckades");
      // return rejectWithValue(
      //   error.response?.data?.message ||
      //     error.response?.data?.errors ||
      //     error.message,
      // );
    }
  },
);

// Async thunk for user login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      // console.log("Logging in with data:", userData);
      const data = await authService.loginUser(userData); // Call the service
      // console.log("Login successful:", data);
      // Removed token storage—backend sets httpOnly cookie
      return {
        message: "Login successful",
        email: userData.loginEmail,
        role: data.user.role,
        // token: data.accessToken
      };
    } catch (error) {
      // console.error("Login error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Ogiltiga autentiseringsuppgifter",
      );
    }
  },
);
// logout thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.logoutUser();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Misslyckades med utloggning");
    }
  }
);

//  Forgot Password thunk
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return { message: data.message || "Password reset email sent" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to send reset email",
      );
    }
  },
);

// thunk for checking auth
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.checkAuth();
      if (!data || !data.email) {
        return rejectWithValue("Cached or invalid response");
      }
      return { email: data.email, role: data.role };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Not authenticated");
    }
  }
);

const initialState = {
  email: null,
  token: null, // Removed reading from localStorage (using cookies now)
  role: null,
  error: {
    register: null,
    login: null,
    logout: null,
    forgot: null,
    checkAuth: null
  },
  loading: {
    register: false,
    login: false,
    logout: false,
    forgot: false,
    checkAuth: false
  },
  message: null,
  success: false,
};

// Create the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = { register: null, login: null, forgot: null, checkAuth:null };
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading.register = true;
        state.error.register = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.loading.register = false;
        state.error.register = null;
        state.message = action.payload.message;
        state.success = true;
        // state.token = action.payload.token;
        // state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading.register = false;
        state.error.register = action.payload;
        state.success = false;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.loading.login = false;
        state.error.login = null;
        state.message = action.payload.message;
        state.success = true;
        // state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading.login = false;
        state.error.login = action.payload;
        state.success = false;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading.logout = true;
        state.error.logout = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading.logout = false;
        // state.user = null;
        state.error.logout = null;
        state.message = action.payload.message
        state.success = true;
        state.token = null;
        state.role = null;
        state.email = null;
      })
      .addCase(logout.rejected,(state, action) =>{
        state.loading.logout = false;
        state.error.logout = action.payload
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loading.forgot = true;
        state.error.forgot = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading.forgot = false;
        state.error.forgot = null;
        state.message = action.payload.message;
        // No success flag change, as it's not a login/register success
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading.forgot = false;
        state.error.forgot = action.payload;
      })
      // CHECK AUTH
      .addCase(checkAuth.pending, (state) => {
        state.loading.checkAuth = true;
        state.error.checkAuth = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.loading.checkAuth = false;
        state.error.checkAuth = null;
        state.success = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading.checkAuth = false;
        state.error.checkAuth = action.payload;
        state.success = false;
        // Reset user data on failure
        state.email = null;
        state.role = null;
      });
  },
});

// Export the clearError action
export const { clearError, clearMessage } = authSlice.actions;
// Export the reducer
export default authSlice.reducer;
