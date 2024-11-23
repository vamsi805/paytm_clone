const mongoose = require("mongoose");

 mongoose.connect("mongodb://localhost:27017/paytm")
.then(()=>console.log('Connected to MongoDB'))
.catch((err)=>console.error('Failed to connect',err));

const {Schema} = mongoose;

const UsercredSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const AccountsSchema = new Schema({
   
    userId : {
        type : Schema.Types.ObjectId,
        ref: 'UserCred',
        required : true
    },
    balance :{
        type : Number,
        required : true
    }
});

const UserCred = mongoose.model('UserCred',UsercredSchema);
const Accounts = mongoose.model('Accounts',AccountsSchema);
module.exports ={UserCred,Accounts};