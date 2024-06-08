const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const SENDER_EMAIL = process.env.SENDER;
const RECEIVER_EMAIL = process.env.RECEIVER;
const PASSWORD_KEY = process.env.PASSWORD_KEY

app.use(bodyParser.json());
app.use(cors({
    origin: ["https://furniture-shop-client-nine.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
}));

mongoose.connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const customerSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    address: String
});

const Customer = mongoose.model('Customer', customerSchema);

app.get('/', async (req, res) => {
    console.log("henlo")
    res.json("Hi")
})

app.post('/api/customers', async (req, res) => {
    const { name, email, phone, address } = req.body;

    const newCustomer = new Customer({ name, email, phone, address });

    try {
        await newCustomer.save();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SENDER_EMAIL,
                pass: PASSWORD_KEY
            }
        });

        let mailOptions = {
            from: SENDER_EMAIL,
            to: RECEIVER_EMAIL,
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
