import React, { useState } from 'react';
import axios from 'axios';

const CustomerForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const { name, email, phone, address } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('https://furniture-shop-api.vercel.app/api/customers', formData);
            alert(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label>Name</label>
                <input type="text" name="name" value={name} onChange={onChange} required />
            </div>
            <div>
                <label>Email</label>
                <input type="email" name="email" value={email} onChange={onChange} required />
            </div>
            <div>
                <label>Phone</label>
                <input type="text" name="phone" value={phone} onChange={onChange} required />
            </div>
            <div>
                <label>Address</label>
                <textarea name="address" value={address} onChange={onChange} required></textarea>
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default CustomerForm;
