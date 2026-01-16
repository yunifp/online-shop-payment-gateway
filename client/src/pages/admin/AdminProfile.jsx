import React, { useState } from 'react';
import { 
  Building2, MapPin, Plus, Edit2, Trash2, ShieldCheck, Phone 
} from 'lucide-react';
import useShopAddress from '../../hooks/useShopAddress'; // Hook dari Anda
import ShopAddressModal from '../../components/ShopAddress';

const AdminProfile = () => {
  // Gunakan Hook useShopAddress
  const { 
    shopAddresses, 
    loading, 
    addShopAddress, 
    updateShopAddress, 
    deleteShopAddress 
  } = useShopAddress();

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Handler Buka Modal Tambah
  const handleAddClick = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit
  const handleEditClick = (addr) => {
    setSelectedAddress(addr);
    setIsModalOpen(true);
  };

  // Handler Submit Form (Tambah/Edit)
  const handleFormSubmit = async (formData) => {
    if (selectedAddress) {
      // Update
      await updateShopAddress(selectedAddress.id, formData);
    } else {
      // Create
      await addShopAddress(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store's delivery addresses.</p>
        </div>
        
        <button 
          onClick={handleAddClick}
          className="flex items-center justify-center px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition shadow-md"
        >
          <Plus size={18} className="mr-2" /> Add Shop Address
        </button>
      </div>

      {/* --- LIST ALAMAT TOKO --- */}
      {loading && shopAddresses.length === 0 ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-theme-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shopAddresses.length > 0 ? (
            shopAddresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-theme-primary/10 p-2 rounded-lg text-theme-primary">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{addr.shop_name}</h3>
                      </div>
                    </div>
                    {/* Badge Utama (Opsional, jika ada field is_primary) */}
                    {addr.is_primary && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <ShieldCheck size={12} className="mr-1" /> Primary
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 mb-4 border border-gray-100">
                    <p className="font-medium text-gray-900 mb-1">{addr.full_address || addr.street}</p>
                    <p>{addr.district_name}, {addr.city_name}</p>
                    <p>{addr.province_name} - {addr.postal_code}</p>
                    {addr.details && <p className="mt-1 text-xs text-gray-500 italic">"{addr.details}"</p>}
                  </div>

                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleEditClick(addr)}
                      className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Edit2 size={16} className="mr-2" /> Edit
                    </button>
                    <button 
                      onClick={() => deleteShopAddress(addr.id)}
                      className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-red-600 bg-red-50 border border-transparent rounded-lg hover:bg-red-100 transition"
                    >
                      <Trash2 size={16} className="mr-2" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No shop address yet</h3>
              <p className="text-gray-500 mb-4">Add an address so customers know where to ship.</p>
              <button onClick={handleAddClick} className="text-theme-primary font-medium hover:underline">
                + Add Address Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- MODAL --- */}
      <ShopAddressModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedAddress}
        onSubmit={handleFormSubmit}
        loading={loading}
      />
    </div>
  );
};

export default AdminProfile;