// ============================================
// ADMIN MENU MANAGER
// ============================================
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Plus, Edit, Trash2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;
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

  const { items: menuItems, loading: menuLoading, error: menuError } = useSelector((state) => state.menu);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess } = useSelector((state) => state.menuAdmin);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchMenuItems = async () => {
    try {
      dispatch(menuRequest());
      const { data } = await axios.get(`${apiUrl}/api/menu`);
      dispatch(menuSuccess(data));
    } catch (err) {
      dispatch(menuFail(err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(menuAdminReset());
      fetchMenuItems();
    }
  }, [deleteSuccess, dispatch]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        dispatch(menuDeleteRequest());
        const { token } = userInfo;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`${apiUrl}/api/menu/${id}`, config);
        dispatch(menuDeleteSuccess());
      } catch (err) {
        dispatch(menuDeleteFail(err.response?.data?.message || err.message));
      }
    }
  };

  const createItemHandler = () => {
    navigate('/admin/menu/create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3]">
      {/* Header */}
      <div className="bg-[#8B4049] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Add Back Button */}
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6 flex items-center gap-2 text-[#FFF8F0] hover:text-[#FFF8F0]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Existing header content */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FFF8F0] rounded-full flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8 text-[#8B4049]" />
              </div>
              <div>
                <h1 className="text-4xl font-serif font-bold text-[#FFF8F0]">
                  Manage Menu
                </h1>
                <p className="text-[#FFF8F0] opacity-90">
                  Add, edit, or remove menu items
                </p>
              </div>
            </div>
            <button
              onClick={createItemHandler}
              className="bg-[#FFF8F0] text-[#8B4049] px-6 py-3 rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create New Item
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Status Messages */}
        {deleteLoading && (
          <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-blue-600 font-semibold">Deleting item...</p>
          </div>
        )}
        {deleteError && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-600 font-semibold">{deleteError}</p>
          </div>
        )}

        {menuLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#8B4049] animate-spin mb-4" />
            <p className="text-[#8B4049] text-lg">Loading menu items...</p>
          </div>
        ) : menuError ? (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 text-lg font-semibold">{menuError}</p>
          </div>
        ) : (
          <div className="bg-[#FFF8F0] rounded-lg shadow-lg overflow-hidden border-2 border-[#8B4049]/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#8B4049] to-[#6B3039]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8B4049]/10">
                  {menuItems.map((item) => (
                    <tr key={item._id} className="hover:bg-[#8B4049]/5 transition-colors">
                      <td className="px-6 py-4">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-[#8B4049] to-[#6B3039] rounded-lg flex items-center justify-center">
                            <span className="text-[#FFF8F0] text-xl font-serif">
                              {item.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#8B4049]">{item.name}</p>
                        <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#8B4049] text-lg">
                          ${item.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-[#8B4049]/10 text-[#8B4049] rounded-full text-sm font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link to={`/admin/menu/${item._id}/edit`}>
                            <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border-2 border-blue-200">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => deleteHandler(item._id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border-2 border-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenuManager;
