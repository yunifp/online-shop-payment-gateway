import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import PageLayout from "./layouts/PageLayout";

// Public Pages
import Homepage from "./pages/Homepage";
import Product from "./pages/Products";
import ProdukDetail from "./pages/ProductDetails";
import Vouchers from "./pages/Vouchers";
import VoucherDetails from "./pages/VoucherDetails";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ProdukList from "./pages/admin/ProdukList";
import Kategori from "./pages/admin/Kategori";
import Voucher from "./pages/admin/Voucher";
import Pengiriman from "./pages/admin/Pengiriman";
import UserManagement from "./pages/admin/UserManagement";
import RiwayatTransaksi from "./pages/admin/Pesanan";
import RiwayatTransaksiCustomer from "./pages/customer/Pesanan"

// Customer Pages
import CompleteProfile from "./pages/customer/CompleteProfile";
import CustomerProfile from "./pages/customer/Profile";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="product/:id" element={<ProdukDetail />} />
        <Route path="vouchers" element={<Vouchers />} />
        <Route path="voucher/:id" element={<VoucherDetails />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cart" element={<Cart />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify" element={<VerifyEmail />} />
      </Route>

      {/* Complete Profile (requires login but not role-specific) */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin & Staff */}
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

      {/* Customer */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute role={["customer"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="profil" replace />} />
        <Route path="profil" element={<CustomerProfile />} />
        <Route path="pesanan" element={<RiwayatTransaksiCustomer />} />
        <Route path="pengiriman" element={<Pengiriman />} />
      </Route>

    </Routes>
  );
}

export default App;
