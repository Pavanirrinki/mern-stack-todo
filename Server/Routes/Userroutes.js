const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")
const User = require('../Models/Usermodel');




router.post("/signup",async(req,res)=>{
const { firstname,email,password} = req.body;
    try{
const user = await User.findOne({email})
if(!user){
    const userdata = new User({
        firstname,email,password
    })
    userdata.save()
    res.status(200).json({userdata})
}else{
    res.status(500).send("User With Same Email Already Exists")
}
    }catch(e){
        res.status(500).json(e)
    }
})


router.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try{
      const existingUser = await User.findOne({ email });
      if(existingUser){
        if(existingUser.password == password){
          let payload={ 
            user:{
                id:existingUser.id
            }
           
        }
        
        jwt.sign(payload,"jwtpassword",(error,token)=>{
         if(error) throw error
       return res.json({token,existingUser})
        
        })
        }else{
          return res.status(400).send("password wrong")
        }
      }else{
        return  res.status(400).send("email wrong")
      }
    }catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  })
  

module.exports = router;