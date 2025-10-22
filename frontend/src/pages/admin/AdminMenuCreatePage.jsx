import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

// 1. Import the "Create" and "Reset" actions
import {
  menuCreateRequest,
  menuCreateSuccess,
  menuCreateFail,
  menuAdminReset,
} from '../../redux/slices/menuAdminSlice';

const AdminMenuCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Form state starts blank
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  // isAvailable defaults to true in our model, so we can omit it

  // 3. Get state from the slices
  const { userInfo } = useSelector((state) => state.auth);
  // We only need the generic loading/error/success state
  const { loading, error, success } = useSelector((state) => state.menuAdmin);

  // 4. This useEffect handles what happens AFTER creation
  useEffect(() => {
    if (success) {
      alert('Item created successfully!');
      dispatch(menuAdminReset());
      navigate('/admin/menumanager');
    }
  }, [dispatch, navigate, success]);

  // 5. Submit handler for the CREATE
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

      // 6. The payload is just the form data
      const payload = { name, price, description, category, imageUrl };

      // 7. Make a POST request (not PUT)
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

      {/* 8. The Form */}
      <form onSubmit={submitHandler}>
        <div>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Price</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Category</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>Image URL</label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>
          Create Item
        </button>
      </form>
    </div>
  );
};

export default AdminMenuCreatePage;