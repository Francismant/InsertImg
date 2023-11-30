import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Forms/Login/Login";
import Register from "./pages/Forms/Register/Register";
import ForgotPassword from "./pages/Security/ForgotPassword";
import ResetPassword from "./pages/Security/ResetPassword";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Homepage />,
            },{
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/forgot",
                element: <ForgotPassword />,
            },
            {
                path: "/reset",
                element: <ResetPassword />,
            },
        ],
    },
]);