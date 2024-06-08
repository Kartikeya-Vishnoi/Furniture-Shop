const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb+srv://incognitoproj:oYqQXYTb8U7DvJRq@cluster0.tymagje.mongodb.net/furnitureshop?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Customer Schema
const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String
});

const Customer = mongoose.model('Customer', customerSchema);

// Endpoint to handle form submission
app.post('/api/customers', async (req, res) => {
    const { name, email, phone, address } = req.body;

    const newCustomer = new Customer({ name, email, phone, address });

    try {
        await newCustomer.save();
        // Set up Nodemailer
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kartikeya.vishnoi29@gmail.com', // replace with your email
                pass: 'xxfverflbjkgpeaq' // replace with your email password
            }
        });

        let mailOptions = {
            from: 'kartikeya.vishnoi29@gmail.com',
            to: 'shiv.govind30@gmail.com', // replace with shop owner's email
            subject: 'New Customer Inquiry',
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send(error.toString());
            }
            res.status(200).send('Customer details sent to the owner!');
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
