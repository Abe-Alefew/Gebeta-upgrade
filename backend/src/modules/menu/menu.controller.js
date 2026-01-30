import { MenuItem } from "../../models/MenuItem.js";
import mongoose from "mongoose";


//@desc get specific menu item by id
//@route GET /api/menu/item/:id
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
  
    const item = await MenuItem.findById(id).populate("business", "name location");

    if (!item) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, message: "Item not found" }));
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, data: item }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc get menu for a business
//@route GET /api/menu/:businessId

export const getMenuByBusiness = async (req, res) => {
  try {
    //get the business id from params
    const { businessId } = req.params;

    //check in the database if it exisits
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, error: "Invalid business ID" }),
      );
    }

    //parse query parameters 
    const {category, available} = req.query;

    //build a query object to dynamically add filters
    const query = { business: businessId };

    if (category) {
      query.category = category;
    }

    if (available) {
      query.isAvailable = available === "true";
    }
    //fetch menu items from the database
    const menuItems = await MenuItem.find(query).populate("business", "name");
// MAP the items to include a single 'image' property for frontend compatibility
    const formattedMenuItems = menuItems.map(item => {
      const itemObj = item.toObject();
      // Find the primary image or default to the first one in the array
      const primaryImage = itemObj.images?.find(img => img.isPrimary) || itemObj.images?.[0];
      
      return {
        ...itemObj,
        image: primaryImage ? primaryImage.url : "" // Send the string the frontend expects
      };
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        success: true,
        data: formattedMenuItems, // Send the formatted version
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc get top-rated menu items
//@route GET /api/menu/:businessId/top

export const getTopItems = async (req, res) => {
  try {
    const { businessId } = req.params;

    const limit = parseInt(req.query.limit) || 5;

    //find the items from database
    const items = await MenuItem.find({ business: businessId })
      .sort({ "rating.average": -1 })
      .limit(limit);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: items,
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc create menu Item as an admin
//@route POST /api/menu

export const createMenuItem = async (req, res) => {
  try {
    const newItem = await MenuItem.create({
      ...req.body,
    });

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: newItem,
        message: "Menu item created successfully",
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc update menu item as an admin
//@route PUT /api/menu/:id
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await MenuItem.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, message: "Menu item not found" }),
      );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        data: updatedItem,
        message: "Menu item updated successfully",
      }),
    );
  } catch (err) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};

//@desc delete menu item as an admin
//@route DELETE /api/menu/:id
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ success: false, message: "Menu item not found" }),
      );
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: true,
        message: "Menu item deleted successfully",
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
};
