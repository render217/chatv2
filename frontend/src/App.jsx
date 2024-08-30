import { Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import AuthLayout from "./layout/AuthLayout";
import { Login, Main, Register } from "./pages";
import { ToastContainer } from "react-toastify";
export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Main />} />
        </Route>
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
      <ToasterProvider />
    </>
  );
}

function ToasterProvider() {
  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover
      />
    </>
  );
}
