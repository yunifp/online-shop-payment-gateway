import React, { useState, useEffect } from 'react';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const KategoriModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const isEditMode = !!category;

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
      });
    }
  }, [category, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = slugify(name);
    setFormData((prev) => ({
      ...prev,
      name: name,
      slug: slug,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? 'Edit Kategori' : 'Tambah Kategori'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Kategori <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
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

export default KategoriModal;