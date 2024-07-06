const express = require('express');
const Record = require('../models/Record');
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const records = await Record.find();
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async(req, res) => {
    const record = new Record(req.body);
    try {
        const newRecord = await record.save();
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async(req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });

        Object.assign(record, req.body);
        await record.save();
        res.json(record);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;