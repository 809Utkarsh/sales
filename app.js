console.log('Server starting...');
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Seller = require('./models/Record');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

mongoose.connect('mongodb://localhost:27017/sellerdb', { useNewUrlParser: true, useUnifiedTopology: true });

const upload = multer({ dest: 'uploads/' });

function transformExcelData(data) {
    return data.map(item => ({
        seller_id: item['Seller ID'],
        seller_name: item['Seller Name'],
        products: [
            {
                product: item['Product'],
                brand: item['Brand'],
                quantity: item['Quantity'],
                buying_price: item['Buying Price'],
                selling_price: item['Selling Price'],
                buying_date: new Date(item['Buying Date']),
                status: item['Status'],
                specifications: {
                    screen_size: item['Screen Size'],
                    battery: item['Battery'],
                    camera: item['Camera'],
                    processor: item['Processor']
                },
                sales: {
                    quantity_sold: item['Quantity Sold'],
                    selling_price: item['Sales Selling Price'].split(',').map(price => parseFloat(price.trim())),
                    selling_date: item['Selling Date'].split(',').map(date => new Date(date.trim())),
                    status: item['Sales Status'].split(',').map(status => status.trim()),
                    returned: item['Returned'],
                    return_dates: item['Return Dates'].split(',').map(date => new Date(date.trim()))
                }
            }
        ]
    }));
}

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
