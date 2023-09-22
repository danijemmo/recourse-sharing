const express = require("express")
const router = express.Router()
const {Users, validation} = require('../module/users')
const bcrypt = require('bcrypt')

const imageMineTypes = ["image/jpeg", "image/png",'image/jpg'];

router.get('/',async(req,res)=>{
    const users = await Users.find({})
    if(!users)return res.status(404).send('there is no user')
    res.send(users)
})

router.get('/:id',async(req,res)=>{
    const users = await Users.findById(req.params.id)
    if(!users)return res.status(404).send('there is no by this id')

    res.send(users)
})

router.post("/signup",async(req,res)=>{
    const {error} = validation(req.body)
    if(error)return res.status(400).send(error.details[0].message)

    const users = new Users({
        name: req.body.name,    
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        profilePicture: req.body.profilePicture,
        bio: req.body.bio,
        social: req.body.social,
        department: req.body.department 
    })
    const salt = await bcrypt.genSalt(10);
    users.password = await bcrypt.hash(users.password,salt)
    
    if(req.body.cover != null && req.body.cover !== ''){
        saveProfile(users, req.body.profilePicture);
      }
    await users.save()
    res.send(users)
})

router.put("/profile/:id",async(req,res)=>{
    const {error} = validation(req.body)
    if(error)return res.status(400).send(error.details[0].message)

    const users = await Users.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        profilePicture: req.body.profilePicture,
        bio: req.body.bio,
        social: req.body,social,
        department: req.body.department 
    },{new:true})

    const salt = await bcrypt.genSalt(10);
    users.password = await bcrypt.hash(users.password,salt)

     await users.save();

    if(!users)return res.status(404).send('there is no user by this id')

    res.send(users)
})

router.delete('/:id',async(req,res)=>{
    const users = await Users.findByIdAndRemove(req.params.id)

    if(!users)return res.status(404).send("there is no user by this id")
    res.send('delete')
})

function saveProfile(users, profileEncoded) {
    if (profileEncoded == null && profileEncoded =='') return;
    const profile = JSON.parse(profileEncoded);
    if (profile != null && imageMineTypes.includes(profile.type)) {
      users.profilePicture = new Buffer(profile.data, "base64");
      users.profilePictureType = profile.type;
    }
  }

module.exports = router

