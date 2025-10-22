import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

// 1. Import all the actions we need from menuAdminSlice
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

  // 2. Form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // 3. Get state from the correct slices
  const { userInfo } = useSelector((state) => state.auth);
  // All our state now comes from 'menuAdmin'
  const {
    item,
    loadingItem,
    errorItem,
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.menuAdmin);

  // 4. This useEffect fetches the item's details AND handles update success
  useEffect(() => {
    // If update was successful, reset and go back
    if (successUpdate) {
      dispatch(menuAdminReset());
      navigate('/admin/menumanager');
    } else {
      // If we don't have the item yet (or ID is wrong), fetch it
      if (!item || item._id !== menuItemId) {
        const fetchItem = async () => {
          try {
            dispatch(menuItemRequest());
            // Use the public GET /api/menu/:id route we built
            const { data } = await axios.get(`http://localhost:5001/api/menu/${menuItemId}`);
            dispatch(menuItemSuccess(data));
          } catch (err) {
            dispatch(menuItemFail(err.response?.data?.message || err.message));
          }
        };
        fetchItem();
      } else {
        // We have the item, so pre-fill the form!
        setName(item.name);
        setPrice(item.price);
        setDescription(item.description);
        setCategory(item.category);
        setImageUrl(item.imageUrl);
        setIsAvailable(item.isAvailable);
      }
    }
  }, [dispatch, navigate, menuItemId, item, successUpdate]);

  // 5. Submit handler for the UPDATE
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
      await axios.put(`http://localhost:5001/api/menu/${menuItemId}`, payload, config);

      dispatch(menuUpdateSuccess());
      // The useEffect will catch successUpdate=true and navigate

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
          {/* All form inputs are the same as before */}
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
          <div>
            <label>Is Available?</label>
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
          </div>
          <button type="submit">Update Item</button>
        </form>
      )}
    </div>
  );
};

export default AdminMenuEditPage;