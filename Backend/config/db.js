const mongoose = require ("mongoose")
require('dotenv').config()
let Url= process.env.mongo_url
const connetion = mongoose.connect(Url)

let userschema = mongoose.Schema({
email:String,
password:String


})

let Usermodel = mongoose.model("users",userschema)

let Histrymodel= mongoose.model("uh",{
    city:String
})

module.exports= {Usermodel,connetion,Histrymodel}
