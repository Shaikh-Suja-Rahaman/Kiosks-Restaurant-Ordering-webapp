import MenuItem from "../models/MenuItem.js";

export const getMenuItems = async (req, res) =>{ //fetch all menu items
  try {

    const items = await MenuItem.find({}) //all the menu items
    res.status(200).json(items);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching menu items' });
  }
}

export const createMenuItem = async (req, res) =>{

  try {

    const {name, description, price, category, imageUrl} = req.body; //isAvailable defaults to true

    const createdItem = await MenuItem.create({
      name, description, price, category, imageUrl
    })

    res.status(201).json(createdItem);

  } catch (error){
    console.error(error);
    res.status(500).json({ message: 'Server error creating menu item' });
  }


}

export const updateMenuItem = async (req, res) => {
  try {
    // 1. Get the new data from the request body
    const { name, description, price, category, imageUrl, isAvailable } = req.body;

    // 2. Find the menu item by its ID
    // req.params.id comes from the URL (e.g., /api/menu/12345)
    const menuItem = await MenuItem.findById(req.params.id);

    // 3. If the item exists, update its fields
    if (menuItem) {
      menuItem.name = name || menuItem.name;
      menuItem.description = description || menuItem.description;
      menuItem.price = price || menuItem.price;
      menuItem.category = category || menuItem.category;
      menuItem.imageUrl = imageUrl || menuItem.imageUrl;
      // We check 'isAvailable' differently since it's a boolean
      if (isAvailable !== undefined) {
        menuItem.isAvailable = isAvailable;
      }

      // 4. Save the updated item back to the database
      const updatedItem = await menuItem.save();
      res.status(200).json(updatedItem);

    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating menu item' });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    // 1. Find the menu item by its ID
    const menuItem = await MenuItem.findById(req.params.id);

    // 2. If it exists, delete it
    if (menuItem) {
      await menuItem.deleteOne(); // Use deleteOne()
      res.status(200).json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting menu item' });
  }
};
