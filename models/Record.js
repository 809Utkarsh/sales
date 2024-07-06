const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    companyId: Number,
    companyName: String,
    nbfcId: Number,
    nbfcName: String,
    loanType: String,
    status: String,
    loanId: Number,
    disbAmount: Number,
    txnId: Number,
    disbDate: Date,
    collAmount: Number,
    collDate: Date,
    collAmount1: Number,
    collDate1: Date,
    collAmount2: Number,
    collDate2: Date
});

module.exports = mongoose.model('Record', RecordSchema);