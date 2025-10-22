import express from 'express';

// 1. Import ALL your controller functions
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
} from '../controllers/menuController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for /api/menu
router.route('/')
  .get(getMenuItems)
  .post(protect, admin, createMenuItem);

// 2. ADD THIS ENTIRE BLOCK
// This tells Express what to do for routes like /api/menu/12345
router.route('/:id')
  .get(getMenuItemById)
  .put(protect, admin, updateMenuItem) // Handles "Update"
  .delete(protect, admin, deleteMenuItem); // Handles "Delete"

export default router;