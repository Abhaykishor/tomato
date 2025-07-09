import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../assets/assets';
import { toast } from 'react-toastify';
import './CategoryList.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ name: '', description: '', image: null });

    const fetchCategories = async () => {
        setLoading(true);
        const res = await axios.get(`${url}/api/category/list`);
        setCategories(res.data.data);
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        const res = await axios.post(`${url}/api/category/delete`, { id });
        if (res.data.success) toast.success(res.data.message);
        else toast.error(res.data.message);
        fetchCategories();
    };

    const handleEdit = (cat) => {
        setEditId(cat._id);
        setEditData({ name: cat.name, description: cat.description, image: null });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', editId);
        formData.append('name', editData.name);
        formData.append('description', editData.description);
        if (editData.image) formData.append('image', editData.image);
        const res = await axios.post(`${url}/api/category/edit`, formData);
        if (res.data.success) toast.success(res.data.message);
        else toast.error(res.data.message);
        setEditId(null);
        fetchCategories();
    };

    const handleReorder = async (id, direction) => {
        const idx = categories.findIndex(cat => cat._id === id);
        if ((direction === -1 && idx === 0) || (direction === 1 && idx === categories.length - 1)) return;
        const newCategories = [...categories];
        const temp = newCategories[idx];
        newCategories[idx] = newCategories[idx + direction];
        newCategories[idx + direction] = temp;
        // Update order fields
        const orders = newCategories.map((cat, i) => ({ id: cat._id, order: i }));
        await axios.post(`${url}/api/category/reorder`, { orders });
        fetchCategories();
    };

    return (
        <div className="category-list-admin">
            <h2>Manage Categories</h2>
            {loading ? <p>Loading...</p> : (
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Dishes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, idx) => (
                            <tr key={cat._id}>
                                <td>
                                    <button onClick={() => handleReorder(cat._id, -1)} disabled={idx === 0}>↑</button>
                                    <button onClick={() => handleReorder(cat._id, 1)} disabled={idx === categories.length - 1}>↓</button>
                                </td>
                                <td><img src={`${url}/images/${cat.image}`} alt={cat.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} /></td>
                                <td>{editId === cat._id ? (
                                    <input value={editData.name} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} />
                                ) : cat.name}</td>
                                <td>{editId === cat._id ? (
                                    <input value={editData.description} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} />
                                ) : cat.description}</td>
                                <td>{cat.dishCount}</td>
                                <td>
                                    {editId === cat._id ? (
                                        <form onSubmit={handleEditSubmit} style={{ display: 'inline' }}>
                                            <input type="file" accept="image/*" onChange={e => setEditData(d => ({ ...d, image: e.target.files[0] }))} />
                                            <button type="submit">Save</button>
                                            <button type="button" onClick={() => setEditId(null)}>Cancel</button>
                                        </form>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(cat)}>Edit</button>
                                            <button onClick={() => handleDelete(cat._id)}>Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CategoryList; 