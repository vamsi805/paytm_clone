const express = require("express");
const {JWT_SECRET} = require("../config.js")
const userRouter = express.Router();
const {userSchemaval,userSchemasSignin} = require('../Schemas/UserSchemaVal.js');
const {UserCred,Accounts} = require("../db.js");
const jwt = require("jsonwebtoken");
const {authMiddleware} = require('../middleware.js');
const zod = require("zod")
userRouter.use(express.json());


userRouter.post('/signup', async (req,res)=>
{
   const cred = req.body;
   let parsed_cred ;
   try{
      parsed_cred = userSchemaval.parse(cred);  
   }catch(err){
     console.error("Invalid inputs" , err)
     res.status(411).json({ error: "Invalid inputs" });
   }
   const exists = await UserCred.findOne({ username: parsed_cred.username});       
   if(!exists)
   {  
      const user = new UserCred(parsed_cred)
      await user.save();
      const balance = Math.floor(Math.random()*999+1);
      const account = new Accounts({
         userId : user._id,
         balance : balance
      });
      await account.save();
      const token = jwt.sign({userId : user._id},JWT_SECRET)
      res.status(200).send(token);             
   }
   else{
      console.error("User already exists");
      res.status(400).json({ error: "User already exists" });
   }
});

userRouter.post('/signin',async (req,res)=>{
 
   const cred = req.body;
   let parsed_cred;
   try{
      parsed_cred = userSchemasSignin.parse(cred);  
   }catch(err){
     console.error("Invalid inputs" , err)
     res.status(411).json({ error: "Invalid inputs" });
   }

   const user = await UserCred.findOne({ username: parsed_cred.username, password : parsed_cred.password});       
   if(user)
   {   
      const token = jwt.sign({userId : user._id},JWT_SECRET)
      res.status(200).send({token : token});  
      console.log("Login success")           
   }
   else{
      console.error("Invalid credentials");
      res.status(400).json({ error: "Invalid credentials" });
   }
    
});

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

userRouter.put('/',authMiddleware,async (req,res) =>{

   const { success } = updateBody.safeParse(req.body)
   if (!success) {
       res.status(411).json({
           message: "Error while updating information"
       })
   }

   await UserCred.updateOne({
       _id: req.userId
   }, req.body)

   res.json({
       message: "Updated successfully"
   })
})


userRouter.get('/bulk',async (req,res) => {
  
   const filter = req.query.filter ;
   
   const users = await UserCred.find({ $or :[{firstName :{"$regex" : filter}},{lastName :{"$regex" : filter}}]},{firstName :1 ,lastName : 1 , _id : 1}).exec()
   
   res.status(200).json({ users : users });
     
})

module.exports = userRouter;