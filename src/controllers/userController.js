const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const createUser = async function (req, res) {
  //You can name the req, res objects anything.
  //but the first parameter is always the request 
  //the second parameter is always the response
  try {
  let data = req.body;
  let savedData = await userModel.create(data);
  console.log(req.newAtribute);
  res.send({ msg: savedData });
}
catch (err){
  console.log("this is the error", err)
  res.status(500).send({error: err.message})
}

};


//************************************* */


const loginUser = async function (req, res) {
  let userName = req.body.emailId;
  let password = req.body.password;
  try {
  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.status(400).send({
      status: false,
      msg: "username or the password is not corerct",
    });

  // Once the login is successful, create the jwt token with sign function
  // Sign function has 2 inputs:
  // Input 1 is the payload or the object containing data to be set in token
  // The decision about what data to put in token depends on the business requirement
  // Input 2 is the secret
  // The same secret will be used to decode tokens
  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "radon",
      organisation: "FunctionUp",
    },
    "functionup-radon"
  );
  res.setHeader("x-auth-token", token);
  res.send({ status: true, token: token });
}
catch (err){
  console.log("this is the error", err)
  res.status(500).send({error: err.message})
}
};


//************************************* */

const getUserData = async function (req, res) {
  let token = req.headers["x-Auth-token"];
  if (!token) token = req.headers["x-auth-token"];

  //If no token is present in the request header return error
  if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

  console.log(token);
  try { 
  // If a token is present then decode the token with verify function
  // verify takes two inputs:
  // Input 1 is the token to be decoded
  // Input 2 is the same secret with which the token was generated
  // Check the value of the decoded token yourself
  let decodedToken = jwt.verify(token, "functionup-radon");
  if (!decodedToken)
    return res.status(406).send({ status: false, msg: "token is invalid" });

  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.status(401).send({ status: false, msg: "No such user exists" });

  res.send({ status: true, data: userDetails });
}
catch (err){
  console.log("this is the error", err)
  res.status(500).send({error: err.message})
}

}

//************************************* */

const updateUser = async function (req, res) {
// Do the same steps here:
// Check if the token is present
// Check if the token present is a valid token
// Return a different error message in both these cases

  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  //Return an error if no user with the given id exists in the db
  try {
  if (!user) {
    return res.status(401).send("No such user exists");
  }

  let userData = req.body;
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData);
  res.send({ status: updatedUser, data: updatedUser });
}
catch (err){
  console.log("this is the error", err)
  res.status(500).send({error: err.message})
}
};

//*********************************** */

const deleteInfo = async function (req, res) {
  let token = req.headers["x-auth-token"];
  if(!token) token = req.headers["x-auth-token"]
  if(!token) return res.status(400).send({status: false, msg: "token must be present"})
  try { 
  let userId = req.params.userId;
  let user = await userModel.findById(userId);

  if (!user) {
    return res.status(400).send("No such user exists");
  }

  let userData = req.body;
  console.log(userData)
  let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, userData);
  res.send({ status: updatedUser, data: updatedUser });
  }
  catch (err){
    console.log("this is the error", err)
    res.status(500).send({error: err.message})
  }
}

//************************************* */

 const postMessage = async function (req, res) {
    try { 
    let message = req.body.message
    let token = req.headers["x-auth-token"]
    if(!token) return res.status(400).send({status: false, msg: "token must be present in the request header"})
    let decodedToken = jwt.verify(token, 'functionup-radon')
    if(!decodedToken) return res.send({status: false, msg:"token is not valid"})
    let userToBeModified = req.params.userId
    let userLoggedIn = decodedToken.userId
    if(userToBeModified != userLoggedIn) return res.send({status: false, msg: 'User logged is not allowed to modify the requested users data'})

    let user = await userModel.findById(req.params.userId)
    if(!user) return res.status(401).send({status: false, msg: 'No such user exists'})
    
    let updatedPosts = user.posts
    updatedPosts.push(message)
    let updatedUser = await userModel.findOneAndUpdate({_id: user._id},{posts: updatedPosts}, {new: true})
    return res.send({status: true, data: updatedUser})
  }
  catch (err){
    console.log("this is the error", err)
    res.status(500).send({error: err.message})
  }


}

module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteInfo =deleteInfo
module.exports.postMessage=postMessage