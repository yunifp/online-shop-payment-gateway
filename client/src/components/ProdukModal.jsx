import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  
  // PERBAIKAN: Gunakan parseFloat untuk menangani nilai desimal "4000.00"
  const numberValue = parseFloat(value); 
  
  if (isNaN(numberValue) || numberValue === 0) return '';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numberValue); // Format angka yang sudah diparsing
};


const parseCurrency = (value) => {
  return value.replace(/[^0-9]/g, '');
};

const ProdukModal = ({ product, categories, onClose, onSave, slugify }) => {
  const isEditMode = !!product;

  const [productData, setProductData] = React.useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    weight_grams: '',
    is_featured: false,
  });

  const [variants, setVariants] = React.useState([
    {
      id: null,
      color: '',
      size: '',
      price: 0,
      stock: '',
      images: [],
    },
  ]);
  
  const [displayedPrices, setDisplayedPrices] = React.useState(['']);
  const [files, setFiles] = React.useState([[]]);
  const [previewUrls, setPreviewUrls] = React.useState([[]]);

  React.useEffect(() => {
    if (isEditMode) {
      setProductData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        category_id: product.category_id || '',
        weight_grams: product.weight_grams || '',
        is_featured: product.is_featured || false,
      });
      const initialVariants = product.variants && product.variants.length > 0
        ? product.variants
        : [{ id: null, color: '', size: '', price: 0, stock: '', images: [] }];
        
      setVariants(initialVariants);
      // Fungsi formatCurrency yang baru akan menangani ini dengan benar
      setDisplayedPrices(initialVariants.map(v => formatCurrency(v.price)));
      setFiles(initialVariants.map(() => []));
      setPreviewUrls(initialVariants.map(() => []));
    }
  }, [product, isEditMode]);

  const cleanUpPreviews = () => {
    previewUrls.forEach(list => list.forEach(url => URL.revokeObjectURL(url)));
  };
  
  const handleClose = () => {
    cleanUpPreviews();
    onClose();
  };
  
  React.useEffect(() => {
    return () => {
      cleanUpPreviews();
    };
  }, [previewUrls]);


  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setProductData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = slugify(name);
    setProductData((prev) => ({
      ...prev,
      name: name,
      slug: slug,
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...variants];
    newVariants[index][name] = value;
    setVariants(newVariants);
  };
  
  const handlePriceChange = (index, e) => {
    const { value } = e.target;
    const numberValue = parseInt(parseCurrency(value), 10) || 0;
    
    const newVariants = [...variants];
    newVariants[index].price = numberValue;
    setVariants(newVariants);
    
    const newDisplayedPrices = [...displayedPrices];
    newDisplayedPrices[index] = formatCurrency(numberValue);
    setDisplayedPrices(newDisplayedPrices);
  };

  const handleFileChange = (index, e) => {
    const newFilesState = [...files];
    const newFilesArray = Array.from(e.target.files);
    newFilesState[index] = newFilesArray;
    setFiles(newFilesState);

    const newPreviewUrlsState = [...previewUrls];
    if (newPreviewUrlsState[index] && newPreviewUrlsState[index].length > 0) {
      newPreviewUrlsState[index].forEach(url => URL.revokeObjectURL(url));
    }
    const newPreviews = newFilesArray.map(file => URL.createObjectURL(file));
    newPreviewUrlsState[index] = newPreviews;
    setPreviewUrls(newPreviewUrlsState);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: null, color: '', size: '', price: 0, stock: '', images: [] },
    ]);
    setDisplayedPrices([...displayedPrices, '']);
    setFiles([...files, []]);
    setPreviewUrls([...previewUrls, []]);
  };

  const removeVariant = (index) => {
    if (previewUrls[index] && previewUrls[index].length > 0) {
      previewUrls[index].forEach(url => URL.revokeObjectURL(url));
    }

    setVariants(variants.filter((_, i) => i !== index));
    setDisplayedPrices(displayedPrices.filter((_, i) => i !== index));
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (variantIndex, imageId) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images = newVariants[variantIndex].images.filter(
      (img) => img.id !== imageId
    );
    setVariants(newVariants);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const variantDataForSubmit = variants.map(v => ({
      ...(v.id && { id: v.id }),
      color: v.color,
      size: v.size,
      price: v.price,
      stock: parseInt(v.stock, 10),
      ...(v.images && { images: v.images }),
    }));
    onSave(productData, variantDataForSubmit, files);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-start z-50 overflow-y-auto py-10">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? 'Edit Produk' : 'Tambah Produk'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={productData.slug}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows="4"
              value={productData.description}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={productData.category_id}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Berat (gram) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="weight_grams"
                value={productData.weight_grams}
                onChange={handleProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="is_featured"
                id="is_featured"
                checked={productData.is_featured}
                onChange={handleProductChange}
                className="h-4 w-4 text-theme-primary border-gray-300 rounded"
              />
              <label
                htmlFor="is_featured"
                className="ml-2 block text-sm text-gray-900"
              >
                Featured
              </label>
            </div>
          </div>

          <hr className="my-6" />

          <h3 className="text-lg font-medium text-gray-900 mb-2">Varian Produk</h3>
          
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <FaTrash size={12}/>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="color"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Warna (cth: Merah)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    name="size"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Ukuran (cth: M)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="price"
                    value={displayedPrices[index]}
                    onChange={(e) => handlePriceChange(index, e)}
                    placeholder="Rp 0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                  />
                  <input
                    type="number"
                    name="stock"
                    value={variant.stock}
                    onChange={(e) => handleVariantChange(index, e)}
                    placeholder="Stok (cth: 10)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gambar Varian
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {isEditMode && variant.images && variant.images.length > 0 && (
                      variant.images.map(img => (
                        <div key={img.id} className="relative">
                          <img src={img.image_url} alt="Existing" className="w-20 h-20 object-cover rounded"/>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index, img.id)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs"
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    )}
                    {previewUrls[index] && previewUrls[index].length > 0 && (
                      previewUrls[index].map((url, i) => (
                        <div key={i} className="relative">
                          <img src={url} alt="Preview" className="w-20 h-20 object-cover rounded"/>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <input
                    type="file"
                    name="images"
                    onChange={(e) => handleFileChange(index, e)}
                    className="w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                    multiple
                    accept="image/jpeg, image/png, image/gif"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hanya JPEG, PNG, or GIF.</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addVariant}
            className="flex items-center text-sm text-theme-primary font-medium"
          >
            <FaPlus className="mr-2" size={12} />
            Tambah Varian
          </button>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdukModal;