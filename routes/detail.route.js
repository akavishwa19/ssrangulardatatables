const express = require("express");
const router = express.Router();
const { Detail } = require("../models/detail.model");
const bcrypt = require("bcrypt");
const { required } = require("nodemon/lib/config");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fetchUser = require("../middleware/jwt.middlleware");
const { name } = require("body-parser");

router.post("/add-details", async (req, res) => {
  try {
    const findUser = await Detail.findOne({ name: req.body.name });
    if (findUser) {
      return res.status(404).send("user already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(req.body.password, salt);
    const newDetail = new Detail({
      name: req.body.name,
      age: req.body.age,
      password: securedPassword,
    });
    await newDetail.save();
    return res.status(200).json(newDetail);
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log(name, password);
    const userWithName = await Detail.findOne({ name: name });
    if (!userWithName) {
      return res.status(400).send("user does not exists");
    }
    const passwordCompare = await bcrypt.compare(
      password,
      userWithName.password
    );
    console.log(passwordCompare);
    if (!passwordCompare) {
      return res.status(400).send("incorrect credentials");
    }
    const payload = {
      id: userWithName._id,
      role: "USER",
    };
    const authToken = await jwt.sign(payload, process.env.SECRET, {
      expiresIn: "17h",
    });
    return res.status(200).json({ authToken, loggedIn: "true" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error");
  }
});

router.get("/get-details", async (req, res) => {
  try {
    const response = await Detail.find();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error");
  }
});

router.get("/logged-in-user", fetchUser, async (req, res) => {
  try {
    const userId = req.uid;
    const loggeinUser = await Detail.findById(userId);
    return res.status(200).json(loggeinUser);
  } catch (error) {
    return res.status(500).send("server error");
  }
});

router.post("/ssr", async (req, res) => {
  try {
    console.log("hi");
    console.log(req.body);
    let searchString = req.body.search.value;
    if (req.body.search.value) {
      var regex = new RegExp(req.body.search.value, "i");
      searchString = {
        $or: [
            {
                name:regex
            },
           
        ],
      };
    }
    else{
        searchString={}
    }
    console.log(searchString)

    let orderData=req.body.order;
    let value=orderData[0];

    let sortObject=req.body.columns[value.column].data;
    let isSortable=req.body.columns[value.column].orderable;    
    let order=value.dir;
    let field="";
    if(order=="asc"){
        field=sortObject;
    }
    else if(order=="desc"){
        field="-"+sortObject;
    }

    var query={};
    query.skip=Number(req.body.start);
    query.limit=Number(req.body.length);
    if(isSortable){
        query.sort=field;
    }
    let recordsTotal=0;
    let recordsFiltered=0;
    let total=await Detail.find().countDocuments();
    recordsTotal=total;
    let filtered=await Detail.find(searchString).countDocuments();
    recordsFiltered=filtered;
    let results=await Detail.find(searchString,{},query).sort({"createdAt":-1});
    if(!results){
        console.log('error');
        return
    }
    var data=JSON.stringify({
        draw:req.body.draw,
        recordsFiltered:recordsFiltered,
        recordsTotal:recordsTotal,
        data:results,
        start:req.body.start
    })
    console.log(data)

    return res.status(200).send(data)
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error");
  }
});

router.post('/test/:role', async (req,res)=>{
  try{
    console.log(req.body)
    console.log(req.body.name)
    // const name=req.body.name;
    // console.log(name)
    const {name}=req.body;
    console.log('name',name);
    console.log(req.params)
    return res.status(200).send('works')
  }
  catch (error){
    console.log(error)
    return res.status(500).send('server error')
  }
})

module.exports = router;
