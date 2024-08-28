const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, tokenService } = require("../services");
const {jwt}= require("jsonwebtoken");
/**
 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *
 *}
 *
 */
const register = catchAsync(async (req, res) => {
   
  let user = await userService.createUser(req.body);
   
  res.status(httpStatus.CREATED).json({ user });
});

/**

 * Example response:
 *
 * {
 *  "user": {
 *      "_id": "5f71b31888ba6b128ba16205",
 *      "name": "crio-user",
 *      "email": "crio-user@gmail.com",
 *      "password": "$2a$08$bzJ999eS9JLJFLj/oB4he.0UdXxcwf0WS5lbgxFKgFYtA5vV9I3vC",
 *      "createdAt": "2020-09-28T09:55:36.358Z",
 *      "updatedAt": "2020-09-28T09:55:36.358Z",
 *      "__v": 0
 *  },
 *  "tokens": {
 *      "access": {
 *          "token": "eyJhbGciOiJIUz....",
 *          "expires": "2020-10-22T09:29:01.745Z"
 *      }
 *  }
 *}
 *
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json({ user, tokens });
});


const authCheck=catchAsync(async(req,res)=>{
  // const token = req.headers.authorization.split(' ')[1];
 
  // if (!token) {
  //   return res.status(401).json({ error: "Unauthorized - No Token Provided" });
  // }
       
  // const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //      console.log(decoded)
  // if (!decoded) {
  //   return res.status(401).json({ error: "Unauthorized - Invalid Token" });
  // }

  // const user = await User.findById(decoded.userId).select("-password");

  // if (!user) {
  //   return res.status(404).json({ error: "User not found" });
  // }

  // res.status(httpStatus.OK).json({msg:"User Authenticated"})
 res.status(httpStatus.OK).json({msg:"User Authenticated"})
})

module.exports = {
  register,
  login,
  authCheck
};
