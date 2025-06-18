import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    allCategory: [],
    subcategory:[],
    product: [],
}

const productSlice = createSlice({
    name: "product",
    initialState: initialValue,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategory = [...action.payload];
        },
        setSubcategory: (state, action) => {
            state.subcategory = [...action.payload];
        },
        setAllProducts: (state, action) => {
            state.product = [...action.payload];
        },
        
    },
});

export const { setAllCategory, setSubcategory, setAllProducts } = productSlice.actions;

export default productSlice.reducer;
