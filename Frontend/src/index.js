import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import AuthForm from './Authorization/components/AuthForm.jsx';
import Main from './Main/Main.jsx';

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "",
    element: <AuthForm />,
  },
  {
    path: "/Main",
    element: <Main />,
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

