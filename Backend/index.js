
const express = require('express')
// const fetch = require ('node-fetch');
const aap = express()
var cors = require('cors')

aap.use(cors())
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Usermodel,connection,Histrymodel} = require("./config/db")
aap.use(express.json())

aap.get("/",(req,res)=>{
    res.send("Api is working")
})


aap.post("/signup",(req,res)=>{
    let {email,pass}= req.body
    bcrypt.hash(pass, 6, function(err, hash) {
        
Usermodel.insertMany([{email,password:hash}])

    });


res.send({"msg":"Regestration successfull"})

})


aap.post("/login",async(req,res)=>{
    let {email,pass}= req.body
    let data=  await Usermodel.find({email})
let hash = data[0].password

bcrypt.compare(pass, hash, async function(err, result) {
    if (result){
let U = await Usermodel.find({email,password:hash})
if (U.length>0){
    const token = jwt.sign({}, 'jay', { expiresIn: "1h" });    
    const refresh_token = jwt.sign({}, 'yaj', { expiresIn: "7d"}); 

    res.status(200).send({"msg":"login successful","token":token ,"Refreshtoken":refresh_token})

}


    }else{
        res.send(err)
    }


});



})







aap.post("/data",async(req,res)=>{
let token = req.headers?.auth
let r_token=req.headers.r_auth
let city= req.body.C


Histrymodel.insertMany([{city}])


jwt.verify(token, 'jay', async function(err, decoded) {
 if(err){
    
if(err.message=="jwt expired"){

    jwt.verify(r_token, 'yaj',async function(err, decoded) {
 
        if(err){
            res.send({"msg":"login please"})
        }else{
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'c8a2861003msh5797e4f2c2ae6bcp151ef3jsnaf5e0f9ca3e9',
                    'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
                }
            };
            
             let Data = await fetch(`https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`, options)
                
            let d= await Data.json()
            res.send(d)
            









        }


      });



}


 }else{ 
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c8a2861003msh5797e4f2c2ae6bcp151ef3jsnaf5e0f9ca3e9',
            'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
        }
    };
    
     let Data = await fetch(`https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`, options)
        
    let d=  await Data.json()
    res.send(d)
    




   
 }
    
  });


})


aap.listen(1700,()=>{
try {
    connection;
    console.log("connection from db success")
} catch (error) {
    console.log("err from db coonection")
}

    console.log("listning to port 1700")
})