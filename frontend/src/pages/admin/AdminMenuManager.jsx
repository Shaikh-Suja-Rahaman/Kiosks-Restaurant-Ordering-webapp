import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 1. Import actions from BOTH menu slices
import { menuRequest, menuSuccess, menuFail } from '../../redux/slices/menuSlice';
import {
  menuDeleteRequest,
  menuDeleteSuccess,
  menuDeleteFail,
  menuAdminReset,
} from '../../redux/slices/menuAdminSlice';

const AdminMenuManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Get state from BOTH slices
  const { items: menuItems, loading: menuLoading, error: menuError } = useSelector((state) => state.menu);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = useSelector((state) => state.menuAdmin);
  const { userInfo } = useSelector((state) => state.auth);

  // 3. This function will fetch the menu
  const fetchMenuItems = async () => {
    try {
      dispatch(menuRequest());
      const { data } = await axios.get('http://localhost:5001/api/menu');
      dispatch(menuSuccess(data));
    } catch (err) {
      dispatch(menuFail(err.response?.data?.message || err.message));
    }
  };

  // 4. This useEffect fetches the menu on load
  useEffect(() => {
    fetchMenuItems();
  }, [dispatch]); // Run once on load

  // 5. This useEffect *watches* for a successful delete
  // If `deleteSuccess` becomes true, it refetches the menu!
  useEffect(() => {
    if (deleteSuccess) {
      alert('Item deleted successfully!');
      dispatch(menuAdminReset()); // Reset the admin state
      fetchMenuItems(); // Refetch the menu list
    }
  }, [deleteSuccess, dispatch]);

  // 6. This handler deletes an item
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        dispatch(menuDeleteRequest());

        // Get the token
        const { token } = userInfo;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Make the PROTECTED API call
        await axios.delete(`http://localhost:5001/api/menu/${id}`, config);

        dispatch(menuDeleteSuccess());
      } catch (err) {
        dispatch(menuDeleteFail(err.response?.data?.message || err.message));
      }
    }
  };

  const createItemHandler = () => {
    // We'll build this page next
    navigate('/admin/menu/create');
    // alert('Create item page not built yet');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Manage Menu</h1>
        <button onClick={createItemHandler}>
          + Create New Item
        </button>
      </div>

      {/* Show loading/error messages */}
      {deleteLoading && <p>Deleting item...</p>}
      {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}

      {menuLoading ? (
        <p>Loading menu...</p>
      ) : menuError ? (
        <p style={{ color: 'red' }}>{menuError}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>{item.category}</td>
                <td>
                  {/* 2. Change this from a <button> to a <Link> */}
                  <Link to={`/admin/menu/${item._id}/edit`}>
                    <button>Edit</button>
                  </Link>
                  <button onClick={() => deleteHandler(item._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMenuManager;