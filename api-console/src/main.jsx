import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./assets/global.css";
import RetailersList from "./routes/retailers/RetailersList.jsx";
import RetailerStores from "./routes/retailers/RetailerStores.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RetailersList/>
  },
  {
    path: "/retailers/:id",
    element: <RetailerStores/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div className="px-4 py-20 sm:px-2 max-w-5xl mx-auto">
    <RouterProvider router={router} />
  </div>
);
