import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaBox,
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { useTransaction } from "../../hooks/useTransaction";
import { useTracking } from "../../hooks/useTracking";
import { toast } from "react-hot-toast";

// --- KOMPONEN TRACKING TIMELINE YANG SUDAH DIPERBAIKI ---
const TrackingTimeline = ({ data }) => {
  if (!data || !data.history || data.history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        <p>No shipping history available from the courier yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-bold text-gray-800 mb-6 flex items-center text-lg">
        <FaTruck className="mr-2 text-theme-primary" /> Tracking History
      </h4>
      
      {/* Garis Vertikal Utama */}
      <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-2">
        {data.history.map((log, index) => (
          <div key={index} className="relative pl-8">
            
            {/* Dot / Indikator Status */}
            <span
              className={`absolute -left-[13px] top-0 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white shadow-sm z-10 transition-all ${
                index === 0
                  ? "bg-theme-primary text-white scale-110"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              {index === 0 ? (
                <FaMapMarkerAlt size={10} />
              ) : (
                <div className="w-2 h-2 bg-gray-100 rounded-full"></div>
              )}
            </span>

            {/* Kartu Konten Status */}
            <div className={`p-4 rounded-xl border transition-all ${
                index === 0 
                ? "bg-white border-theme-primary/30 shadow-md" 
                : "bg-gray-50/50 border-gray-100 hover:bg-white hover:shadow-sm"
            }`}>
              <time className="block mb-2 text-xs font-bold text-gray-400 flex items-center uppercase tracking-wider">
                <FaClock className="mr-1.5" size={11} />
                {new Date(log.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>

              <h3 className={`text-sm font-bold leading-relaxed ${
                  index === 0 ? "text-theme-primary" : "text-gray-800"
              }`}>
                {log.desc || log.message || "Status Updated"}
              </h3>

              {log.location && (
                <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                  <FaMapMarkerAlt className="mr-1.5" size={10} />
                  {log.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- HALAMAN UTAMA PENGIRIMAN ---
const Pengiriman = () => {
  const {
    transactions,
    loading: loadingList,
    fetchTransactions,
  } = useTransaction();
  const {
    getTracking,
    trackingData,
    loading: trackingLoading,
    clearTracking,
  } = useTracking();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchTransactions({ status: "shipped", limit: 50 });
  }, [fetchTransactions]);

  const handleSearch = () => {
    if (!searchTerm) return;

    const found = transactions.find(
      (t) =>
        t.order_id_display?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.shipping_receipt_number &&
          t.shipping_receipt_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

    if (found) {
      setSelectedOrder(found);
      getTracking(found.order_id_display);
    } else {
      toast.error("Data not found in active shipping list.");
      setSelectedOrder(null);
      clearTracking();
    }
  };

  const handleSelectOrder = (transaction) => {
    setSelectedOrder(transaction);
    setSearchTerm(transaction.order_id_display);
    getTracking(transaction.order_id_display);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10 px-4 sm:px-0">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Shipping Management
        </h1>
        <div className="hidden md:block text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          Total Active:{" "}
          <span className="font-bold text-theme-primary text-lg ml-1">
            {transactions.length}
          </span>
        </div>
      </div>

      {/* TRACKING SECTION */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
           <FaSearch className="text-theme-primary" /> Track Order
        </h2>

        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Order ID (TRX-...) or Tracking Number"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-theme-primary/10 focus:border-theme-primary outline-none transition text-gray-700"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={trackingLoading}
            className="bg-theme-primary hover:bg-theme-primary-dark text-white font-bold py-3 px-8 rounded-xl transition disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-theme-primary/20"
          >
            {trackingLoading ? "Tracking..." : "Track Package"}
          </button>
        </div>

        {selectedOrder && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 mb-8 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2 bg-blue-100 inline-block px-2 py-1 rounded">
                    Order Information
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {selectedOrder.order_id_display}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 flex flex-col gap-2">
                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-bold">RECIPIENT</span>
                    <div className="mx-2 flex flex-col gap-1">
                    <span className="font-semibold text-gray-800">
                      {selectedOrder.user?.name || "Customer"}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedOrder.user?.email || "Customer"}
                    </span>
                    </div>
                    
                  </p>
                </div>
                
                <div className="text-left md:text-right bg-white p-4 rounded-xl border border-blue-100 shadow-sm min-w-[200px]">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                    Courier Service
                  </p>
                  <p className="font-black text-theme-primary text-xl mb-2">
                    {(selectedOrder.courier || "").toUpperCase()}
                  </p>
                  <div className="border-t border-dashed border-gray-200 pt-2 mt-2">
                     <p className="text-xs text-gray-400 font-bold uppercase mb-1">Tracking Number</p>
                     <p className="font-mono text-sm text-gray-800 font-medium select-all bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block">
                        {selectedOrder.shipping_receipt_number || "Not Available"}
                     </p>
                  </div>
                </div>
              </div>

              {trackingData && trackingData.summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-blue-100 pt-6">
                  <div className="bg-white p-3 rounded-lg border border-blue-50 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                    <p className="font-bold text-blue-600 text-sm mt-1">
                      {trackingData.summary.status}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-50 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Date</p>
                    <p className="font-medium text-gray-700 text-sm mt-1">
                      {trackingData.summary.date || "-"}
                    </p>
                  </div>
                  <div className="col-span-2 bg-white p-3 rounded-lg border border-blue-50 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Description</p>
                    <p className="font-medium text-gray-700 text-sm mt-1 truncate">
                      {trackingData.summary.courier || "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {trackingLoading ? (
              <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theme-primary mx-auto mb-3"></div>
                <p className="text-gray-500 font-medium">Fetching real-time data...</p>
              </div>
            ) : (
              <TrackingTimeline data={trackingData} />
            )}
          </div>
        )}
      </div>

      {/* TABEL LIST PENGIRIMAN */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FaBox className="text-gray-400" /> Active Shipments List
          </h2>
          <button
            onClick={() => fetchTransactions({ status: "shipped", limit: 50 })}
            className="text-sm font-bold text-theme-primary hover:text-theme-primary-dark hover:bg-theme-primary/10 px-3 py-1.5 rounded-lg transition"
          >
            Refresh List
          </button>
        </div>

        {loadingList ? (
          <div className="p-12 text-center text-gray-500">
             <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-theme-primary mx-auto mb-3"></div>
             Loading shipments...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-16 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <FaBox size={32} className="text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-bold mb-1">No Active Shipments</h3>
            <p className="text-gray-500 text-sm">
              There are no packages with 'Shipped' status at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Order ID / Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Tracking Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-theme-primary group-hover:underline">
                          {item.order_id_display}
                        </span>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <FaClock size={10}/>
                          {new Date(item.created_at).toLocaleDateString("en-US")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="px-2 py-0.5 text-[10px] font-black rounded bg-gray-100 text-gray-600 uppercase border border-gray-200">
                             {item.courier || "N/A"}
                           </span>
                        </div>
                        <div className="text-sm text-gray-800 font-mono font-medium">
                          {item.shipping_receipt_number || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="font-semibold text-gray-800">{item.user?.name}</div>
                        <div className="text-xs text-gray-400">{item.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleSelectOrder(item)}
                          className="text-theme-primary bg-theme-primary/10 hover:bg-theme-primary hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm border border-theme-primary/20"
                        >
                          Track Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4 p-4 bg-gray-50">
              {transactions.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm active:scale-[0.99] transition-transform"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-theme-primary font-black text-lg">
                        {item.order_id_display}
                        </p>
                        <p className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString("en-US")}
                        </p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 uppercase border border-gray-200">
                      {item.courier || "N/A"}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Tracking Number</p>
                      <p className="font-mono text-gray-800 font-bold select-all">
                        {item.shipping_receipt_number || "-"}
                      </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-semibold text-gray-500">
                          To: {item.user?.name}
                      </span>
                      <button
                        onClick={() => handleSelectOrder(item)}
                        className="bg-white border border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm"
                      >
                        Track
                      </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pengiriman;