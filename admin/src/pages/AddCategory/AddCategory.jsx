import React, { useState } from 'react';
import '../Add/Add.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategory = () => {
    const [image, setImage] = useState(false);
    const [name, setName] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!image) {
            toast.error('Image not selected');
            return null;
        }
        if (!name.trim()) {
            toast.error('Category name required');
            return null;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);
        const response = await axios.post(`${url}/api/category/add`, formData);
        if (response.data.success) {
            toast.success(response.data.message);
            setName("");
            setImage(false);
        } else {
            toast.error(response.data.message);
        }
    };

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>
                <div className='add-img-upload flex-col'>
                    <p>Upload category image</p>
                    <input onChange={(e) => { setImage(e.target.files[0]); e.target.value = '' }} type="file" accept="image/*" id="image" hidden />
                    <label htmlFor="image">
                        <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
                    </label>
                </div>
                <div className='add-product-name flex-col'>
                    <p>Category name</p>
                    <input name='name' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Type here' required />
                </div>
                <button type='submit' className='add-btn' >ADD CATEGORY</button>
            </form>
        </div>
    );
};

export default AddCategory; 