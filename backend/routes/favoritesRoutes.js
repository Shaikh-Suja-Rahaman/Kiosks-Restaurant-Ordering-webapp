import { addFavorite, removeFavorite, getFavorites } from "../controllers/favoritesController.js";
import { protect } from "../middleware/authMiddleware.js";

import express from 'express'

const router = express.Router()
router.use(protect);

router.route('/').get(getFavorites).post(addFavorite)

router.route('/:id').delete(removeFavorite);
// Remove a favorite (sends ID in URL)

export default router;