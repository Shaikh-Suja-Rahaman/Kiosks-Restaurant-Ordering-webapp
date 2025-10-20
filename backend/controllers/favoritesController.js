import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Get logged-in user's favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    // 1. Find the user from the 'protect' middleware
    // 2. 'populate' the 'favorites' field to get the full MenuItem objects
    const user = await User.findById(req.user._id).populate('favorites');
    //now this favourites fileds will be completely full fo the original things in the menuItems

    if (user) {
      res.status(200).json(user.favorites);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching favorites' });
  }
};

// @desc    Add a menu item to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    const { menuItemId } = req.body;

    // 1. Check if the menu item actually exists
    const itemExists = await MenuItem.findById(menuItemId);
    if (!itemExists) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // 2. Find the user
    const user = await User.findById(req.user._id);

    // 3. Add the item to the 'favorites' array
    // We use Mongoose's '$addToSet' to prevent duplicates
    await user.updateOne({ $addToSet: { favorites: menuItemId } });

    res.status(200).json({ message: 'Item added to favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding favorite' });
  }
};

// @desc    Remove a menu item from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    // 1. Get the MenuItem ID from the URL parameters
    const menuItemId = req.params.id;

    // 2. Find the user
    const user = await User.findById(req.user._id);

    // 3. Remove the item from the 'favorites' array
    // We use Mongoose's '$pull' to remove all instances of that ID
    await user.updateOne({ $pull: { favorites: menuItemId } });

    res.status(200).json({ message: 'Item removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing favorite' });
  }
};