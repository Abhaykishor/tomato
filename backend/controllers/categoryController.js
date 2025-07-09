import categoryModel from "../models/categoryModel.js";
import foodModel from "../models/foodModel.js";
import fs from 'fs';

// List all categories with dish count
const listCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ order: 1 });
        // For each category, count dishes
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const count = await foodModel.countDocuments({ category: cat.name });
            return { ...cat.toObject(), dishCount: count };
        }));
        res.json({ success: true, data: categoriesWithCount });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Add a new category
const addCategory = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`;
        const { name, description = "" } = req.body;
        const order = await categoryModel.countDocuments();
        const category = new categoryModel({
            name,
            image: image_filename,
            description,
            order
        });
        await category.save();
        res.json({ success: true, message: "Category Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Edit a category
const editCategory = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        let update = { name, description };
        if (req.file) {
            update.image = req.file.filename;
        }
        await categoryModel.findByIdAndUpdate(id, update);
        res.json({ success: true, message: "Category Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Delete a category (only if not in use)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const cat = await categoryModel.findById(id);
        const count = await foodModel.countDocuments({ category: cat.name });
        if (count > 0) {
            return res.json({ success: false, message: "Cannot delete: category in use." });
        }
        // Remove image file
        fs.unlink(`uploads/${cat.image}`, () => {});
        await categoryModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Category Deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Reorder categories
const reorderCategories = async (req, res) => {
    try {
        const { orders } = req.body; // [{id, order}, ...]
        for (const { id, order } of orders) {
            await categoryModel.findByIdAndUpdate(id, { order });
        }
        res.json({ success: true, message: "Order updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { listCategories, addCategory, editCategory, deleteCategory, reorderCategories }; 