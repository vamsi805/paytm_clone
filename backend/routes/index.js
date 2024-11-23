const express = require("express");
const userRouter = require("./user.js");
const apiRouter = express.Router();
const acctRouter = require('./acct.js');


apiRouter.use('/user',userRouter);
apiRouter.use('/account',acctRouter);


module.exports = {apiRouter};