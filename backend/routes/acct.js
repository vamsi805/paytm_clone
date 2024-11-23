const express = require("express");
const acctRouter = express.Router();
const {authMiddleware} = require('../middleware.js');
const {UserCred,Accounts} = require("../db.js");
const mongoose = require('mongoose');

acctRouter.get('/balance',authMiddleware, async (req,res)=>{
   
    const userId = req.userId;
   
    const acct = await Accounts.findOne({
        userId: req.userId
    });

    res.status(200).json({balance : acct.balance});

});

acctRouter.post('/transfer',authMiddleware, async (req,res) => {
    
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
    
 
});

module.exports = acctRouter;
