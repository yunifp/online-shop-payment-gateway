import React, { useState } from 'react';
import { FaPlus, FaPencilAlt, FaTrash, FaImage } from 'react-icons/fa';
import { useProduk } from '../../hooks/useProduct';
import ProdukModal from '../../components/ProdukModal';
import { Toaster } from 'react-hot-toast';

const formatCurrency = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

const ProdukList = () => {
  const {
    products,
    categories,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    slugify,
  } = useProduk();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL ? API_URL.replace('/api/v1', '') : '';

  const handleOpenModal = (product = null) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleSave = async (productData, variantsData, files) => {
    const formData = new FormData();

    formData.append('name', productData.name);
    formData.append('slug', productData.slug);
    formData.append('description', productData.description);
    formData.append('category_id', productData.category_id);
    formData.append('weight_grams', productData.weight_grams);
    formData.append('is_featured', productData.is_featured);

    if (currentProduct) {
      const plainVariants = variantsData.map((v) => ({
        id: v.id,
        color: v.color,
        size: v.size,
        price: v.price,
        stock: v.stock,
        images: v.images || [],
      }));
      formData.append('variants', JSON.stringify(plainVariants));

      variantsData.forEach((variant, index) => {
        const fileKey = variant.id
          ? `variant_${variant.id}_images`
          : `variant_new_${index}_images`;
        if (files[index] && files[index].length > 0) {
          files[index].forEach((file) => {
            formData.append(fileKey, file);
          });
        }
      });

      await updateProduct(currentProduct.id, formData);
    } else {
      formData.append('variants', JSON.stringify(variantsData));
      files.forEach((fileList, index) => {
        if (fileList && fileList.length > 0) {
          fileList.forEach((file) => {
            formData.append(`variant_${index}_images`, file);
          });
        }
      });
      await addProduct(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    deleteProduct(id);
  };

  const getProductStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((acc, v) => acc + v.stock, 0);
  };

  const getProductPrice = (variants) => {
    if (!variants || variants.length === 0) return 0;
    const prices = variants.map((v) => v.price);
    return Math.min(...prices);
  };

  const getProductThumbnail = (variants) => {
    if (!variants || variants.length === 0) return null;
    
    for (const variant of variants) {
      if (variant.images && variant.images.length > 0) {
        return variant.images[0].image_url;
      }
    }
    return null;
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-content-bg shadow-xl rounded-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-main">List Products</h1>
          <button
            onClick={() => handleOpenModal(null)}
            className="flex items-center bg-theme-primary hover:bg-theme-primary-dark text-white font-medium py-2 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border-main">
          <table className="min-w-full divide-y divide-border-main">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Product Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Price (Starting from)
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Total Stocks
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-content-bg divide-y divide-border-main">
              {loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-text-muted"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-red-500"
                  >
                    Error: {error}
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                products.map((product) => {
                  const totalStock = getProductStock(product.variants);
                  const price = getProductPrice(product.variants);
                  const thumbUrl = getProductThumbnail(product.variants);

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {thumbUrl ? (
                          <img 
                            src={`${BASE_URL}${thumbUrl}`} 
                            alt={product.name} 
                            className="h-12 w-12 object-cover rounded-md border border-gray-200"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                            <FaImage />
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-text-main">
                          {product.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-muted">
                          {product.category?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-text-muted">
                          {formatCurrency(price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            totalStock > 0 ? 'text-text-muted' : 'text-red-600'
                          }`}
                        >
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.is_featured
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.is_featured ? 'Featured' : 'Regular'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-150 p-2 rounded-full hover:bg-blue-100"
                          title="Edit"
                        >
                          <FaPencilAlt size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-150 p-2 rounded-full hover:bg-red-100"
                          title="Delete"
                        >
                          <FaTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProdukModal
          product={currentProduct}
          categories={categories}
          onClose={handleCloseModal}
          onSave={handleSave}
          slugify={slugify}
        />
      )}
    </>
  );
};

export default ProdukList;