import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  ReceiptText,
  Package,
  Truck,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { useTransaction } from '../../hooks/useTransaction';

const StatCard = ({ icon, title, value, description, isLoading }) => {
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
        {isLoading ? (
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className="text-4xl font-semibold text-text-main">{value}</p>
        )}
        {description && (
          <p className="text-sm text-text-muted mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

const formatCurrencyCompact = (value) => {
  if (value >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(1)}M`;
  }
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}jt`;
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
};

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isUser = user?.role === 'user';
  
  const [stats, setStats] = useState({
    revenue: 0,
    transactions: 0,
    shipping: 0
  });
  
  const { getDashboardStats, loading } = useTransaction();

  useEffect(() => {
    if (!isUser) {
      const fetchStats = async () => {
        const data = await getDashboardStats();
        if (data) {
          setStats(data);
        }
      };
      fetchStats();
    }
  }, [isUser]);

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
            New Order
          </h3>
          <p className="text-text-muted">Check order details</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-text-main mb-8">
        Welcome Back, Admin
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Penjualan"
          value={formatCurrencyCompact(stats.revenue)}
          description="Bulan ini"
          isLoading={loading}
        />
        <StatCard
          icon={ReceiptText}
          title="Transaksi"
          value={stats.transactions}
          description="Bulan ini"
          isLoading={loading}
        />
        <StatCard
          icon={Truck}
          title="Pengiriman"
          value={stats.shipping}
          description="Dalam Pengiriman"
          isLoading={loading}
        />
      </div>


    </>
  );
};

export default Dashboard;