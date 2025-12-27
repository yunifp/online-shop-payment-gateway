import React from 'react';
import {
  DollarSign,
  ReceiptText,
  Package,
  Truck,
  ShoppingBag,
  Clock
} from 'lucide-react';


const StatCard = ({ icon, title, value, description }) => {
  const IconComponent = icon;
  return (
    <div className="bg-content-bg p-6 rounded-2xl shadow-sm border border-border-main">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-muted uppercase tracking-wide">
          {title}
        </h3>
        <IconComponent size={20} className="text-text-subtle" />
      </div>
      <div>
        <p className="text-4xl font-semibold text-text-main">{value}</p>
        {description && (
          <p className="text-sm text-text-muted mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isUser = user?.role === 'user';

  if (isUser) {
    return (
      <>
        <h1 className="text-4xl font-bold text-text-main mb-8">
          Halo, {user?.name || 'Pelanggan'}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={ShoppingBag}
            title="Total Pesanan"
            value="12"
            description="Riwayat belanja anda"
          />
          <StatCard
            icon={Truck}
            title="Dalam Pengiriman"
            value="2"
            description="Pesanan sedang dikirim"
          />
          <StatCard
            icon={Clock}
            title="Menunggu Pembayaran"
            value="1"
            description="Segera selesaikan pembayaran"
          />
        </div>

        <div className="mt-8 bg-content-bg p-6 rounded-2xl shadow-sm border border-border-main">
          <h3 className="text-xl font-semibold mb-4 text-text-main">
            Pesanan Terbaru
          </h3>
          <p className="text-text-muted">Silahkan cek menu Pesanan untuk detail lengkap.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-text-main mb-8">
        Selamat Datang, Admin
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Penjualan"
          value="Rp 12,5jt"
          description="Bulan ini"
        />
        <StatCard
          icon={ReceiptText}
          title="Transaksi"
          value="32"
          description="Bulan ini"
        />
        <StatCard
          icon={Package}
          title="LOW STOCK"
          value="1"
          description="Sleeping Bag"
        />
        <StatCard
          icon={Truck}
          title="Pengiriman"
          value="78"
          description="Dalam Pengiriman"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-content-bg p-6 rounded-2xl shadow-sm border border-border-main">
          <h3 className="text-xl font-semibold mb-4 text-text-main">
            Grafik Penjualan
          </h3>
          <div className="h-80 bg-zinc-100 rounded-lg flex items-center justify-center text-text-muted">
            [Placeholder Grafik]
          </div>
        </div>
        <div className="bg-content-bg p-6 rounded-2xl shadow-sm border border-border-main">
          <h3 className="text-xl font-semibold mb-4 text-text-main">
            Produk Terlaris
          </h3>
          <ul className="space-y-4">
            <li className="flex justify-between items-center">
              <div>
                <p className="text-text-main font-medium">Tenda Dome</p>
                <p className="text-sm text-text-muted">SKU: TD-001</p>
              </div>
              <span className="font-semibold text-text-main">25x</span>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-text-main font-medium">Sepatu Gunung</p>
                <p className="text-sm text-text-muted">SKU: SG-045</p>
              </div>
              <span className="font-semibold text-text-main">18x</span>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-text-main font-medium">Carrier 60L</p>
                <p className="text-sm text-text-muted">SKU: CR-060</p>
              </div>
              <span className="font-semibold text-text-main">12x</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;