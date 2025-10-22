import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

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
              `http://localhost:5001/api/menu/${menuItemId}`
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
        `http://localhost:5001/api/menu/${menuItemId}`,
        payload,
        config
      );

      dispatch(menuUpdateSuccess());
    } catch (err) {
      dispatch(menuUpdateFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/menumanager')}>
        &larr; Go Back
      </button>
      <h1>Edit Menu Item</h1>

      {loadingUpdate && <p>Updating item...</p>}
      {errorUpdate && <p style={{ color: 'red' }}>{errorUpdate}</p>}

      {loadingItem ? (
        <p>Loading item details...</p>
      ) : errorItem ? (
        <p style={{ color: 'red' }}>{errorItem}</p>
      ) : (
        <form onSubmit={submitHandler}>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste a URL here"
            />
          </div>
          <div>
            <label>Or Upload File</label>
            <input
              type="file"
              onChange={uploadFileHandler}
            />
            {uploading && <p>Uploading image...</p>}
          </div>
          {imageUrl && (
            <div>
              <p>Image Preview:</p>
              <img
                src={imageUrl}
                alt="Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
          )}
          <div>
            <label>Is Available?</label>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
            />
          </div>
          <button type="submit" disabled={loadingUpdate || uploading}>
            Update Item
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminMenuEditPage;

