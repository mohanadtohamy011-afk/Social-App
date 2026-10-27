import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./index.css";
import Authlayout from "./Layout/Authlayout";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import MainLayout from "./Layout/MainLayout";
import Newsfeed from "./Pages/Newsfeed/Newsfeed";
import Profile from "./Pages/Profile/Profile";
import Notification from "./Pages/Notification/Notification";
import Notfound from "./Pages/Notfound/Notfound";
import { Toaster } from "react-hot-toast";
import AppProtectedRoute from "./components/ProtectedRoutes/AppProtectedRoute";
import AuthProtectedRoute from "./components/ProtectedRoutes/AuthProtectedRoute";
import PostDetails from "./Pages/PostDetails/PostDetails";




export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/auth", element: <AuthProtectedRoute><Authlayout /></AuthProtectedRoute>,
      children: [
        { index: true, element: <Navigate to="login" replace /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> }
      ]
    },
    {
      path: "", element: <AppProtectedRoute><MainLayout /></AppProtectedRoute>,
      children: [
        { index: true, element: <Navigate to="/feed" /> },
        { path: "feed", element: <Newsfeed /> },
        { path: "profile", element: <Profile /> },
        { path: "notification", element: <Notification /> },
        { path: "postDetails/:id", element: <PostDetails /> },

      ]
    },
    { path: "*", element: <Notfound /> }
  ])


  return (
    <>
      <Toaster />
      <RouterProvider router={routes} />
    </>
  )
}
