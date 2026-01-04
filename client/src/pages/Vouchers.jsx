import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TicketPercent, Archive, ArrowLeft } from 'lucide-react';
import VoucherCard from '../components/common/VoucherCard';
import { useVoucher } from '../hooks/useVoucher';

const Vouchers = () => {
  const { vouchers, loading, error } = useVoucher();

  // Filter only ACTIVE and NON-EXPIRED vouchers
  const activeVouchers = useMemo(() => {
    if (!vouchers) return [];
    
    const now = new Date();
    
    return vouchers.filter(v => {
      const expiryDate = new Date(v.end_date);
      // Ensure status is active & date hasn't passed
      return v.is_active && expiryDate > now;
    }).sort((a, b) => {
      // Sort by created_at (newest) or ID
      return new Date(b.created_at || b.id) - new Date(a.created_at || a.id);
    });
  }, [vouchers]);

  if (loading) return <div className="py-20 text-center text-gray-500">Loading vouchers...</div>;
  if (error) return <div className="py-20 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-app-bg min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 border-b border-border-main pb-6">
          <Link to="/product" className="inline-flex items-center text-text-muted hover:text-theme-primary mb-4 transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Products
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-main flex items-center gap-3">
                < TicketPercent className="text-theme-primary" size={36} />
                Vouchers
              </h1>
              <p className="text-text-muted mt-2">
                Use the voucher codes below at checkout to get a discount.
              </p>
            </div>
          </div>
        </div>

        {/* Voucher Grid */}
        {activeVouchers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeVouchers.map((voucher) => (
              <div key={voucher.id} className="relative group transition-transform hover:-translate-y-1">
                <Link to={`/voucher/${voucher.id}`} className="block h-full">
                  <VoucherCard voucher={voucher} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-border-main rounded-xl">
            <Archive size={48} className="mx-auto text-zinc-300 mb-4" />
            <h3 className="text-xl font-medium text-text-main">No active vouchers</h3>
            <p className="text-text-muted mt-1">
              Currently, there are no promos available. Check back again later!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Vouchers;