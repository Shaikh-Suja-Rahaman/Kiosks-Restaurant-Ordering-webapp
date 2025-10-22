import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

// Import the "Create" and "Reset" actions
import {
  menuCreateRequest,
  menuCreateSuccess,
  menuCreateFail,
  menuAdminReset,
} from '../../redux/slices/menuAdminSlice';

const AdminMenuCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state starts blank
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // State for tracking the upload
  const [uploading, setUploading] = useState(false);

  // Get state from the slices
  const { userInfo } = useSelector((state) => state.auth);
  // We only need the generic loading/error/success state
  const { loading, error, success }  = useSelector((state) => state.menuAdmin);

  // This useEffect handles what happens AFTER creation
  useEffect(() => {
    if (success) {
      alert('Item created successfully!');
      dispatch(menuAdminReset());
      navigate('/admin/menumanager');
    }
  }, [dispatch, navigate, success]);

  // This function handles the file upload to Cloudinary
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // POST directly to Cloudinary's API
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        config
      );

      setImageUrl(data.secure_url); // Set the URL from Cloudinary
      setUploading(false);
    } catch (error) {
      console.error('Image upload failed:', error);
      setUploading(false);
    }
  };

  // This handler submits the new item to our backend
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(menuCreateRequest());

    try {
      const { token } = userInfo;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      // The payload is just the form data
      const payload = { name, price, description, category, imageUrl };

      // Make a POST request to our backend
      await axios.post('http://localhost:5001/api/menu', payload, config);

      dispatch(menuCreateSuccess());
      // The useEffect will catch success=true and navigate

    } catch (err) {
      dispatch(menuCreateFail(err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/admin/menumanager')}>
        &larr; Go Back
      </button>
      <h1>Create New Menu Item</h1>

      {loading && <p>Creating item...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* The full form */}
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

        {/* Image URL text input */}
        <div>
          <label>Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or paste a URL here"
          />
        </div>

        {/* Image file upload input */}
        <div>
          <label>Or Upload File</label>
          <input
            type="file"
            onChange={uploadFileHandler}
          />
          {uploading && <p>Uploading image...</p>}
        </div>

        {/* Image preview */}
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

        <button type="submit" disabled={loading || uploading}>
          Create Item
        </button>
      </form>
    </div>
  );
};

export default AdminMenuCreatePage;