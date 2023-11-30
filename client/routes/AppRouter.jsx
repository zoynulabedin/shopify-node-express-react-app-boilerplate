import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Authentication from "../authentication/Authentication";
const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/authenticate",
    element: <Authentication />,
  },
]);

export default AppRouter;
