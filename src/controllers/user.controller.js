const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");

/**
 * Get user details
 */
const getUser = catchAsync(async (req, res) => {
  // if(req.params.userId!==req.user._id.toString()){
  //   throw new ApiError(httpStatus.FORBIDDEN,"an authenticated user tries to access a different users data");
  // }
  //   if(req.query.q){
  //     const result=await userService.getUserAddressById(req.params.userId);
  //     res.status(httpStatus.OK).json(result);
  //   }
  //   else{
  //   let result=await userService.getUserById(req.params.userId,req.user);
  //   res.status(httpStatus.OK).json(result);
  //   }
  let data;

  if(req.query.q === "address"){
    data = await userService.getUserAddressById(req.params.userId)
  }
  else{
   data = await userService.getUserById(req.params.userId)
 
  }

  if (data.email !== req.user.email){
    throw new ApiError(httpStatus.FORBIDDEN, "User not Authenticated to see other user's data");
  }

  if(!data){
    throw new ApiError(httpStatus.NOT_FOUND,"User Not Found")
  }

  if(req.query.q ==="address"){
    res.send({
      address:data.address
    })
  }
  else{
  res.send(data)
  }
});

const setAddress = catchAsync(async (req, res) => {
  
  const user = await userService.getUserById(req.params.userId);
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.email != req.user.email) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "User not authorized to access this resource"
    );
  }

  const address = await userService.setAddress(user, req.body.address);

  res.status(httpStatus.OK).json({
    status:200,
    msg:"Address updated successfully",
    address: address,
  });
});

module.exports = {
  getUser,
  setAddress,
};
