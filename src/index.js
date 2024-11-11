import React from "react";
import reportWebVitals from "./reportWebVitals";
import ReactDOM from "react-dom/client";
import App from "./App";
import Authentication, {
  AuthenticationMode,
} from "./components/Authentication";
import ErrorPage from "./ErrorPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserProvider from "./context/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";


const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
  },
  {
    path: "/signin",
    element: <Authentication authenticationMode={AuthenticationMode.Login} />,
  },
  {
    path: "/signup",
    element: (
      <Authentication authenticationMode={AuthenticationMode.Register} />
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();