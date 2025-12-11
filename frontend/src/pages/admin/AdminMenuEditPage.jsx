import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { MenuSquare, Loader2, AlertCircle, Upload, ArrowLeft } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
// Import all the actions we need
import {
  menuUpdateRequest,
  menuUpdateSuccess,
  menuUpdateFail,
  menuAdminReset,
  menuItemRequest,
  menuItemSuccess,
  menuItemFail,
} from '../../redux/slices/menuAdminSlice';

const AdminMenuEditPage = () => {
  const { id: menuItemId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [uploading, setUploading] = useState(false);

  const categories = [
  'Burgers',
  'Meals',
  'Pizzas',
  'Biryanis',
  'Sandwich',
  'Hot Beverages',
  'Cold Beverages',
];

  // Get state from slices
  const { userInfo } = useSelector((state) => state.auth);
  const {
    item,
    loadingItem,
    errorItem,
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.menuAdmin);

  // useEffect to fetch item details and handle update success
  useEffect(() => {
    if (successUpdate) {
      dispatch(menuAdminReset());
      navigate('/admin/menumanager');
    } else {
      if (!item || item._id !== menuItemId) {
        const fetchItem = async () => {
          try {
            dispatch(menuItemRequest());
            const { data } = await axios.get(
              `${apiUrl}/api/menu/${menuItemId}`

            );
            dispatch(menuItemSuccess(data));
          } catch (err) {
            dispatch(menuItemFail(err.response?.data?.message || err.message));
          }
        };
        fetchItem();
      } else {
        setName(item.name);
        setPrice(item.price);
        setDescription(item.description);
        setCategory(item.category);
        setImageUrl(item.imageUrl || '');
        setIsAvailable(item.isAvailable);
      }
    }
  }, [dispatch, navigate, menuItemId, item, successUpdate]);

  // This function handles the file upload to Cloudinary
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      // --- THIS IS THE FIX ---
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post(
        // --- AND THIS IS THE FIX ---
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        config
      );

      setImageUrl(data.secure_url);
      setUploading(false);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploading(false);
    }
  };

  // This handler submits the UPDATE to our backend
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(menuUpdateRequest());

    try {
      const { token } = userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const payload = { name, price, description, category, imageUrl, isAvailable };
      await axios.put(
        `${apiUrl}/api/menu/${menuItemId}`,
        payload,
        config
      );

      dispatch(menuUpdateSuccess());
    } catch (err) {
      dispatch(menuUpdateFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header */}
      <div className="bg-[#8B4049] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center">
              <MenuSquare className="w-8 h-8 text-[#8B4049]" />
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#FFF8F0]">
                Edit Menu Item
              </h1>
              <p className="text-[#FFF8F0] opacity-90">
                Update your menu item details
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/admin/menumanager')}
          className="mb-6 flex items-center gap-2 text-[#8B4049] hover:text-[#6B3039] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Menu Manager
        </button>

        {/* Status Messages */}
        {loadingUpdate && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-blue-600 font-semibold">Updating item...</p>
          </div>
        )}
        {errorUpdate && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 font-semibold">{errorUpdate}</p>
          </div>
        )}

        {loadingItem ? (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-blue-600 font-semibold">Loading item details...</p>
          </div>
        ) : errorItem ? (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 font-semibold">{errorItem}</p>
          </div>
        ) : (
          <div className="bg-[#FFF8F0] rounded-lg shadow-lg p-8 border-2 border-[#8B4049]/10">
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#8B4049] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#8B4049]/20 focus:border-[#8B4049] focus:ring-2 focus:ring-[#8B4049]/20 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8B4049] mb-2">
                  Price (Rs)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#8B4049]/20 focus:border-[#8B4049] focus:ring-2 focus:ring-[#8B4049]/20 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8B4049] mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#8B4049]/20 focus:border-[#8B4049] focus:ring-2 focus:ring-[#8B4049]/20 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8B4049] mb-2">
                  Category
                </label>
                <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      required
      className="w-full px-4 py-2 rounded-lg border-2 border-[#8B4049]/20 focus:border-[#8B4049] focus:ring-2 focus:ring-[#8B4049]/20 outline-none transition-colors bg-white"
    >
      <option value=""  defaultChecked >Select a category</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8B4049] mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste a URL here"
                  className="w-full px-4 py-2 rounded-lg border-2 border-[#8B4049]/20 focus:border-[#8B4049] focus:ring-2 focus:ring-[#8B4049]/20 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8B4049] mb-2">
                  Upload Image
                </label>
                <div className="mt-1 flex items-center gap-4">
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#8B4049]/10 text-[#8B4049] rounded-lg hover:bg-[#8B4049]/20 transition-colors">
                    <Upload className="w-5 h-5" />
                    Choose File
                    <input
                      type="file"
                      onChange={uploadFileHandler}
                      className="hidden"
                    />
                  </label>
                  {uploading && (
                    <span className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </span>
                  )}
                </div>
              </div>

              {imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#8B4049] mb-2">Preview:</p>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-[#8B4049]/20"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-[#8B4049]">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-[#8B4049]/20 text-[#8B4049] focus:ring-[#8B4049]"
                  />
                  Item is available
                </label>
              </div>

              <button
                type="submit"
                disabled={loadingUpdate || uploading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white
                  ${loadingUpdate || uploading
                    ? 'bg-[#8B4049]/50 cursor-not-allowed'
                    : 'bg-[#8B4049] hover:bg-[#6B3039] transition-colors'}`}
              >
                {loadingUpdate ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  'Update Item'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenuEditPage;
