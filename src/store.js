import {combineReducers,applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {legacy_createStore as createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import { productReducer, productDetailsReducer } from "./reducers/productReducer";
import { userDetailsReducer, userReducer } from "./reducers/userReducer";

const reducer =  combineReducers({
    products: productReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    userDetails: userDetailsReducer,
})
let initialState={};
const middleware = [thunk];
const store = createStore(
    reducer, 
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)))

export default store;