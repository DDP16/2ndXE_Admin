import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./app/modules/services/Post";
import accountReducer from "./app/modules/services/Account";
import postPaymentReducer from "./app/modules/services/PostPayment";
import loginReducer from "./app/pages/Login/loginStore";
import reportReducer from "./app/modules/services/Report";

export const store = configureStore({
    reducer: {
        post: postReducer,
        account: accountReducer,
        postPayment: postPaymentReducer,
        login: loginReducer,
        report: reportReducer,
    }
});