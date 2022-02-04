const User = require("../models/user");
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const GetUsers = async(req,res,next) => {

  try{
    const data = await User.find({}, "-password");

    res.json({users: data.map(user => user.toObject({getters: true}))});

  }catch(err){
    res.status(401).send({message: "Failed to fetch users. Please try again later"});
    throw new Error(err);
  }

}

const GetUserById = async (req,res,next) => {

  const userId = req.params.uid;

  try {
    const user = await User.findById(userId);

    if(!user)throw new Error("Cannot find user with provided ID")

    res.status(200).send({user: user});
  } catch (err) {
    res.status(501).send({message: "Cannot load user with provided id"});
    console.log("error'as: ", err);
  }

}


// < CRUD OPERATIONS >


const POST_signUp = async(req,res,next) => {

    const {name, email, password} = req.body;

    let hashedPassword;

    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      console.log(err);
      res.status(501).send({message: "Failed to bcrypt ypur password :("});
    }

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      name: name,
      email: email,
      password: hashedPassword,
      image: "image url2",
      places: []
    })

    try {
      const egsistingUser = await User.find({email: email})

      if(egsistingUser.length > 0){
        const errText = "The email address you have entered is already associated with another account.";
        res.status(501).send({message: errText})
        throw new Error(errText)
      }
      
      await newUser.save();

      let token = jwt.sign(
        {userId: egsistingUser._id, email: egsistingUser.email},
        "supersecret_dont_share",
        {expiresIn: "1h"}
      );

      console.log("Registracija sekminga")

      res.status(200).send({user: newUser, token: token})
      
    } catch (err) {
      res.status(501).send({
        message: "Registration fails! Please try again"
      })
    }

}

const Login = async (req,res,next) => {
  const {email,password} = req.body;

  let indentifiedUser;

  try{
    indentifiedUser = await User.findOne({email: email})

    if(!indentifiedUser){
      res.status(501).send({message: "Cannot find user with provided email! Please try again..."});
    }

  }catch(err){
    res.status(501).send({message: "Cannot find user with provided email! Please try again..."});
    console.log(err);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, indentifiedUser.password);

    if(!isValidPassword){
      res.status(500).send({message: "Wrong password! Please try again..."});
    }

    let token = jwt.sign(
      {userId: indentifiedUser._id, email: indentifiedUser.email},
      "supersecret_dont_share",
      {expiresIn: "1h"}
    );

    console.log("Prisijungimas sekmingas")

    res.status(200).send({user: indentifiedUser, token: token})

  } catch (err) {
    res.status(501).send({message: "failed to login..."});
  }

  
}

exports.GetUsers = GetUsers;
exports.GetUserById = GetUserById;
exports.POST_signUp = POST_signUp;
exports.Login = Login;
