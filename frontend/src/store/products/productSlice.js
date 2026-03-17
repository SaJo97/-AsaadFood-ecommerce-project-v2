import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productService from "./productService";

const initialState = {
  products: [],
  product: null,
  error: {
    getAll: null,
    getOne: null,
    create: null,
    update: null,
    delete: null,
  },
  loading: {
    getAll: false,
    getOne: false,
    create: false,
    update: false,
    delete: false,
  }
};

// function to get all products
export const getAllProducts = createAsyncThunk(
  "product-list/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getAll();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// function to get product detail
export const getProductById = createAsyncThunk(
  "product-list/getProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await productService.getProduct(productId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Function to create a product
export const createProduct = createAsyncThunk(
  "product-list/createNewProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createNewProduct(productData);
      return response; // Return the created product data
    } catch (error) {
      // console.error("Error creating product:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response?.data || "Failed to create product");
    }
  },
);

// Function to update a product
export const updateProduct = createAsyncThunk(
  "product-list/update",
  async (product, { rejectWithValue }) => {
    try {
      const updatedProduct = await productService.update(product);
      return updatedProduct;
    } catch (error) {
      // console.error("Error updating product:", error);
      return rejectWithValue(error.message);
    }
  },
);

// Function to delete a product
export const deleteProduct = createAsyncThunk(
  "product-list/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(productId);
      return productId;
    } catch (error) {
      // console.error("Error deleting product:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const productsSlice = createSlice({
  name: "product-list",
  initialState,
  reducers: {
     clearError: (state) => {
      state.error = {
        getAll: null,
        getOne: null,
        create: null,
        update: null,
        delete: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading.getAll = true;
        state.error.getAll = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading.getAll = false;
        state.error.getAll = action.payload;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading.getAll = false;
        state.error.getAll = null;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading.getOne = true;
        state.error.getOne = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading.getOne = false;
        state.error.getOne = action.payload;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading.getOne = false;
        state.error.getOne = null;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload); // Optimistic update
        state.loading.create = false;
        state.error.create = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        // Rollback: Remove the optimistically added product
        if (state.products.length > 0) {
          state.products.pop();
        }
        state.loading.create = false;
        state.error.create = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload; // Optimistic update
        }
        state.loading.update = false;
        state.error.update = null;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        ); // Optimistic update
        state.loading.delete = false;
        state.error.delete = null;
      });
  },
});

export default productsSlice.reducer;
