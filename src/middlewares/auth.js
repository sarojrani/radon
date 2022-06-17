const authenticate =  async function (req, res, next){
    let token = req.headers["x-Auth-token"] || req.headers["x-auth-token"]
  console.log(token)
  if(!token)  res.send({status: false, msg: "token must be present"})
  try { 
  let decodedToken = jwt.verify(token, "functionup-radon");
  let userId = req.params.userId;
  let userLoggedIn = decodedToken.userId;
  
  if(userId!=userLoggedIn)
  return res.send(
    "User logged in is not allowed to modified another users data"
  );
  
  let user = await userModel.findById(userId);
  if (!user) {
    return res.send("No such user exists")
  }
  req.user = user;
  }catch (error) {
    return res.send("the token is Invalid")
  }
  next()
  }
  
  module.exports.authenticate =authenticate
