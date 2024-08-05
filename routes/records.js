const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Seller = require('./models/record');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // serve static files

mongoose.connect('mongodb://localhost:27017/sellerdb', { useNewUrlParser: true, useUnifiedTopology: true });

const upload = multer({ dest: 'uploads/' });

const transformExcelData = (data) => {
    return data.map(item => ({
        sellerId: item['Seller Id'],
        sellerName: item['Seller Name'],
        product: item['Product'],
        brand: item['Brand'],
        quantity: item['Quantity'],
        buyingPrice: item['Buying Price'],
        buyingDate: new Date(item['Buying Date']),
        sellingPrice: item['Selling Price'],
        status: item['Status']
    }));
};

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Transform jsonData to match the Seller schema
        const transformedData = transformExcelData(jsonData);

        await Seller.insertMany(transformedData);
        fs.unlinkSync(file.path); // Remove the file after processing
        res.status(200).send('File uploaded and data inserted successfully.');
    } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).send('Error processing file.');
    }
});

app.post('/add-data', async (req, res) => {
    try {
        const data = req.body;
        await Seller.insertMany(data);
        res.status(200).send('Data inserted successfully.');
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data.');
    }
});

app.get('/sellers', async (req, res) => {
    try {
        const sellers = await Seller.find();
        res.json(sellers);
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
