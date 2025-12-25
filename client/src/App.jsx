import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import PageLayout from "./layouts/PageLayout";

import Homepage from "./pages/Homepage";
import Product from "./pages/Products";
import ProdukDetail from "./pages/ProductDetails";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/admin/Dashboard";
import ProdukList from "./pages/admin/ProdukList";
import Kategori from "./pages/admin/Kategori";
import Voucher from "./pages/admin/Voucher";
import Pengiriman from "./pages/admin/Pengiriman";
import UserManagement from "./pages/admin/UserManagement";
import RiwayatTransaksi from "./pages/admin/Pesanan";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="product/:id" element={<ProdukDetail />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role={["admin", "staff"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="produk" element={<ProdukList />} />
        <Route path="kategori" element={<Kategori />} />
        <Route path="voucher" element={<Voucher />} />
        <Route path="pengiriman" element={<Pengiriman />} />
        <Route path="pesanan" element={<RiwayatTransaksi />} />
        <Route
          path="users"
          element={
            <ProtectedRoute role="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
