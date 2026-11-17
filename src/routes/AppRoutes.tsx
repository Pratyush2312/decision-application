import { createBrowserRouter, RouterProvider } from "react-router";

import App from "../App";
import DecisionBuilder from "../pages/DecisonBuilder";
import Results from "../pages/Result";
const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <DecisionBuilder />,
        },
        {
          path: "results",
          element: <Results />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router}/>
};

export default AppRoutes;