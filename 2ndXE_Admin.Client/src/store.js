import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./app/modules/services/Post";
import accountReducer from "./app/modules/services/Account";
import postPaymentReducer from "./app/modules/services/PostPayment";
import loginReducer from "./app/pages/Login/loginStore"; // Assuming loginReducer is defined in your loginStore.js

export const store = configureStore({
    reducer: {
        post: postReducer,
        account: accountReducer,
        postPayment: postPaymentReducer,
        login: loginReducer,
    }
});