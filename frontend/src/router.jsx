import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home/Home";
import About from "./pages/Social/About";
import Contact from "./pages/Social/Contact";
import RiceProducts from "./pages/Product/RiceProducts";
import OliveoilProducts from "./pages/Product/OliveoilProducts";
import Checkout from "./pages/Product/Checkout";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import Profile from "./pages/User/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./pages/Admin/AdminPage";
import CreateProduct from "./pages/Admin/CreateProduct";
import UpdateUser from "./pages/Admin/UpdateUser";
import NotFound from "./components/NotFound";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "om-oss",
        element: <About />,
      },
      {
        path: "kontakta-oss",
        element: <Contact />,
      },
      {
        path: "produkt_ris",
        element: <RiceProducts />,
      },
      {
        path: "produkt_ris/:productId",
        element: <RiceProducts />,
      },
      {
        path: "produkt_olivolja",
        element: <OliveoilProducts />,
      },
      {
        path: "produkt_olivolja/:productId",
        element: <OliveoilProducts />,
      },
      {
        path: "kassa",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "auth/logga-in",
        element: <Login />,
      },
      {
        path: "auth/registrera",
        element: <Register />,
      },
      {
        path: "konto",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "adminpanel",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        )
      },
      {
        path: "adminpanel/:productId",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
          </ProtectedRoute>
        )
      },
      {
        path: "adminpanel/skapa",
        element: (
          <ProtectedRoute requiredRole="admin">
            <CreateProduct />
          </ProtectedRoute>
        )
      },
      {
        path: "adminpanel/hantera",
        element: (
          <ProtectedRoute requiredRole="admin">
            <UpdateUser />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);
