import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Minus, Plus, TicketPercent, X, ArrowRight, Clipboard } from 'lucide-react';
import useCart from '../hooks/useCart';
import { useVoucher } from '../hooks/useVoucher';
import toast from 'react-hot-toast';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Cart = () => {
  const { cart, loading, updateItem, deleteItem, clearCart } = useCart();
  const { vouchers, loading: voucherLoading } = useVoucher();

  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherStatus, setVoucherStatus] = useState(null);

  const inputVoucherRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL ? API_URL.split('/api')[0] : '';

  const constructImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    let cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    if (cleanPath.startsWith('uploads/')) return `${BASE_URL}/${cleanPath}`;
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  const handleQtyChange = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;
    try { await updateItem(id, newQty); } catch (err) { toast.error("Gagal update stok"); }
  };

  const handleRemove = async (id) => {
    try { await deleteItem(id); toast.success("Item dihapus"); } catch (err) { toast.error("Gagal menghapus item"); }
  };

  const handleClearCart = async () => {
    if (window.confirm("Yakin ingin mengosongkan keranjang?")) {
      try {
        await clearCart();
        setAppliedVoucher(null);
        setVoucherCode("");
        toast.success("Keranjang dikosongkan");
      } catch (error) {
        toast.error("Gagal mengosongkan keranjang");
      }
    }
  };

  const cartItems = cart?.items || [];
  const subtotal = Number(cart?.subtotal) || 0;

  useEffect(() => {
    if (appliedVoucher) {
      const minPurchase = Number(appliedVoucher.min_purchase) || 0;
      if (subtotal < minPurchase) {
        setAppliedVoucher(null);
        setVoucherCode("");
        toast.error(`Voucher dilepas. Total belanja kurang dari ${formatCurrency(minPurchase)}`);
      }
    }
  }, [subtotal, appliedVoucher]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setVoucherCode(text.toUpperCase());
        setVoucherStatus(null);
        toast.success("Kode berhasil ditempel!");
        if (inputVoucherRef.current) inputVoucherRef.current.focus();
      } else {
        toast("Clipboard kosong", { icon: '⚠️' });
      }
    } catch {
      toast.error("Gagal menempel kode");
    }
  };

  const handleApplyVoucher = () => {
    setVoucherStatus(null);

    if (!voucherCode.trim()) {
      setVoucherStatus({ type: "error", message: "Silakan masukkan kode voucher" });
      return;
    }

    const voucher = vouchers.find(v => v.code.toLowerCase() === voucherCode.trim().toLowerCase());

    if (!voucher) {
      setVoucherStatus({ type: "error", message: "Voucher tidak tersedia atau kode salah" });
      return;
    }

    const now = new Date();
    const startDate = new Date(voucher.start_date);
    const endDate = new Date(voucher.end_date);

    const isExpired = now > endDate;
    const notStarted = now < startDate;
    const isInactive = !voucher.is_active;
    const isQuotaEmpty = voucher.quota <= 0;

    if (isExpired || notStarted || isInactive || isQuotaEmpty) {
      setVoucherStatus({ type: "error", message: "Voucher sudah tidak berlaku" });
      return;
    }

    const minPurchase = Number(voucher.min_purchase) || 0;

    if (subtotal < minPurchase) {
      setVoucherStatus({
        type: "info",
        message: `Voucher tidak dapat digunakan karena ketentuan tidak terpenuhi. Minimal belanja ${formatCurrency(minPurchase)}`
      });
      return;
    }

    setAppliedVoucher(voucher);
    setVoucherStatus({ type: "success", message: "Voucher berhasil digunakan" });
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    setVoucherStatus(null);
    toast.success("Voucher dilepas");
  };

  const discountAmount = useMemo(() => {
    if (!appliedVoucher) return 0;
    const currentSubtotal = Number(subtotal);
    const minPurchase = Number(appliedVoucher.min_purchase) || 0;
    const val = Number(appliedVoucher.value) || 0;
    const maxDisc = Number(appliedVoucher.max_discount) || 0;
    if (currentSubtotal < minPurchase) return 0;
    let disc = 0;
    if (appliedVoucher.type === 'percentage') {
      disc = currentSubtotal * (val / 100);
      if (maxDisc > 0) disc = Math.min(disc, maxDisc);
    } else {
      disc = val;
    }
    return Math.min(disc, currentSubtotal);
  }, [appliedVoucher, subtotal]);

  const finalTotal = subtotal - discountAmount;

  if (loading && !cart) {
    return <div className="bg-app-bg min-h-screen py-12 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-app-bg min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-text-main mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-content-bg p-12 border border-border-main rounded-lg shadow-sm">
            <ShoppingBag size={64} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-xl font-medium text-text-main">Your Cart is Empty</p>
            <Link to="/product" className="inline-block mt-6 bg-theme-primary text-white font-medium py-3 px-8 rounded-lg shadow-md hover:bg-theme-primary-dark">Belanja Sekarang</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-content-bg border border-border-main rounded-lg shadow-sm overflow-hidden">
                <ul className="divide-y divide-border-main">
                  {cartItems.map((item) => (
                    <li key={item.cart_item_id} className="flex flex-col sm:flex-row gap-6 p-6">
                      <div className="w-24 h-24 bg-zinc-100 rounded-md border border-border-main flex-shrink-0 overflow-hidden relative">
                        {item.image_url ? (
                          <img
                            src={constructImageUrl(item.image_url)}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100?text=No+Img"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">No IMG</div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-text-main">{item.product_name}</h3>
                          {item.variant_name && <p className="text-sm text-zinc-500 mt-1">Variant: {item.variant_name}</p>}
                        </div>
                        <p className="text-theme-primary font-bold mt-2">{formatCurrency(item.price)}</p>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <div className="hidden sm:flex items-center border border-border-main rounded-md bg-white">
                          <button onClick={() => handleQtyChange(item.cart_item_id, item.quantity, -1)} disabled={item.quantity <= 1} className="p-2 hover:bg-zinc-50 disabled:opacity-50"><Minus size={16} /></button>
                          <span className="text-sm font-bold w-10 text-center">{item.quantity}</span>
                          <button onClick={() => handleQtyChange(item.cart_item_id, item.quantity, 1)} className="p-2 hover:bg-zinc-50"><Plus size={16} /></button>
                        </div>
                        <p className="hidden sm:block font-bold text-text-main text-lg mt-4">{formatCurrency(item.item_total)}</p>
                        <button onClick={() => handleRemove(item.cart_item_id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-content-bg border border-border-main rounded-lg shadow-md p-6 sticky top-28">
                <h2 className="text-2xl font-bold text-text-main mb-6">Ringkasan</h2>

                <div className="space-y-4 text-zinc-600">
                  <div className="flex justify-between">
                    <span>Subtotal Product</span>
                    <span className="font-medium text-text-main">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="border-t border-b border-dashed border-zinc-300 py-4 my-2">
                    <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-text-main">
                      <TicketPercent size={18} className="text-theme-primary" />
                      <span>Code Voucher</span>
                    </div>

                    {!appliedVoucher ? (
                      <>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              ref={inputVoucherRef}
                              type="text"
                              value={voucherCode}
                              onChange={(e) => { setVoucherCode(e.target.value); setVoucherStatus(null); }}
                              placeholder="Masukkan kode..."
                              className="w-full text-sm border border-border-main rounded-md pl-3 pr-9 py-2 bg-white uppercase focus:outline-none focus:border-theme-primary transition-colors"
                              disabled={voucherLoading}
                            />

                            <button
                              onClick={handlePaste}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 p-1 rounded transition-colors"
                              type="button"
                            >
                              <Clipboard size={14} />
                            </button>
                          </div>

                          <button
                            onClick={handleApplyVoucher}
                            disabled={!voucherCode || voucherLoading}
                            className="bg-zinc-800 text-white text-sm px-4 py-2 rounded-md font-medium hover:bg-zinc-700 disabled:bg-zinc-300"
                          >
                            {voucherLoading ? '...' : 'Gunakan'}
                          </button>
                        </div>

                        {voucherStatus && (
                          <p
                            className={
                              "mt-2 text-xs font-medium " +
                              (voucherStatus.type === "success"
                                ? "text-green-600"
                                : voucherStatus.type === "info"
                                ? "text-amber-600"
                                : "text-red-600")
                            }
                          >
                            {voucherStatus.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-md p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-green-700 uppercase">{appliedVoucher.code}</p>
                              <span className="bg-green-200 text-green-800 text-[10px] px-1.5 rounded font-bold">APPLIED</span>
                            </div>
                            <p className="text-xs text-green-600 mt-1">Hemat {formatCurrency(discountAmount)}</p>
                          </div>

                          <button onClick={handleRemoveVoucher} className="text-red-400 hover:text-red-600">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Voucher</span>
                      <span className="font-medium">- {formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="text-green-600 font-medium text-sm bg-green-50 px-2 py-1 rounded">Gratis (Promo)</span>
                  </div>
                </div>

                <hr className="border-border-main my-6" />

                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold text-text-main text-lg">Total</span>
                  <span className="font-bold text-2xl text-theme-primary-dark">{formatCurrency(finalTotal)}</span>
                </div>

                <button className="w-full bg-theme-primary text-white font-bold py-4 rounded-lg shadow-lg hover:bg-theme-primary-dark flex justify-center items-center gap-2">
                  <span>Checkout</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
