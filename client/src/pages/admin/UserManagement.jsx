import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useUserManagement } from '../../hooks/useUserManagement';
import UserModal from '../../components/userModal';
import { Toaster } from 'react-hot-toast';

const getRoleClass = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-amber-100 text-amber-800';
    case 'staff':
      return 'bg-blue-100 text-blue-800';
    case 'customer':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const UserManagement = () => {
  const { users, loading, error, addUser, updateUser, deleteUser } = useUserManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleOpenModal = (user = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSave = async (formData) => {
    try {
      if (currentUser) {
        if (formData.password === '') {
          delete formData.password;
        }
        await updateUser(currentUser.id, formData);
      } else {
        await addUser(formData);
      }
      handleCloseModal();
    } catch (err) {
      // Error toast sudah ditangani oleh hook
    }
  };

  const handleDelete = (user) => {
    deleteUser(user.id, user.role);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-content-bg shadow-xl rounded-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-main">Manajemen User</h1>
          <button
            onClick={() => handleOpenModal(null)}
            className="flex items-center bg-theme-primary hover:bg-theme-primary-dark text-white font-medium py-2 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaPlus className="mr-2" />
            Tambah User
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border-main">
          <table className="min-w-full divide-y divide-border-main">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Nama</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>

            <tbody className="bg-content-bg divide-y divide-border-main">
              {loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-text-muted">
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              )}
              {!loading && !error && users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-main">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                      {capitalizeFirstLetter(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-theme-primary hover:text-theme-primary-dark transition-colors duration-150 p-2 rounded-full hover:bg-blue-100"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-150 p-2 rounded-full hover:bg-red-100"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <UserModal
          user={currentUser}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default UserManagement;