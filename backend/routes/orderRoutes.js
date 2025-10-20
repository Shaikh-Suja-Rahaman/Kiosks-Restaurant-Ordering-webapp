import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for creating an order
// We use 'protect' because *any* logged-in user can place an order
router.route('/')
  .post(protect, placeOrder)         // Customer: Place an order
  .get(protect, admin, getAllOrders); // Admin: Get all orders

// --- Customer-specific routes ---
// '/myorders' MUST come before '/:id'
router.route('/myorders')
  .get(protect, getMyOrders);       // Customer: Get their own orders

// --- Routes for a specific order ID ---
router.route('/:id')
  .get(protect, getOrderById);      // Customer OR Admin: Get one order

// --- Admin-specific routes ---
router.route('/:id/status')
  .put(protect, admin, updateOrderStatus); // Admin: Update order status

export default router;
