const {z} = require("zod");


const userSchemaval = z.object({
     username : z.string().email().min(3).max(30),
     firstName: z.string().max(50),
     lastName : z.string().max(50),
     password : z.string().min(6)
})

const userSchemasSignin = z.object({
    username : z.string().email().min(3).max(30),
    password : z.string().min(6)
})



module.exports = {userSchemaval,userSchemasSignin};