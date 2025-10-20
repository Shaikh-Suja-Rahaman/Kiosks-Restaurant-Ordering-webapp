import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';

const router = express.Router();

router.get('/', getMenuItems);

router.post('/', protect, admin, createMenuItem); //creation is only
//something that my admin can do

// 2. Add new routes for /api/menu/:id
// We chain PUT and DELETE to this specific ID route
router.put('/', protect, admin, updateMenuItem);
router.delete('/',protect, admin, deleteMenuItem);

export default router;