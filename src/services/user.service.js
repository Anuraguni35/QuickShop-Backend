const { User, Seller, Buyer } = require("../models/index");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const getUserById = async (id) => {
  let result = await User.findOne({ _id: id });
  // console.log("id",id);
  // console.log("result",result);
  return result;
};

const getUserByEmail = async (email) => {
  let result = await User.findOne({ email });
  return result;
};

const createUser = async (body) => {
  try {
    if (await User.isEmailTaken(body.email)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "User already exists with the same email"
      );
    }

    let { password } = await body;
    let salt = await bcrypt.genSalt();
    let hpassword = await bcrypt.hash(password, salt);

    if (body.role === "buyer") {
      const buyer = new Buyer({ ...body, password: hpassword });
      const response = await buyer.save();
      return response;
    } else if (body.role === "seller") {
      console.log("check==>", body.role);
      let seller = new Seller({ ...body, password: hpassword });
      const response = await seller.save();
      return response;
    }
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
};

const getUserAddressById = async (id) => {
  return User.findOne({ _id: id }, { email: 1, address: 1 });
};

const setAddress = async (user, newAddress) => {
  user.address = newAddress;
  await user.save();
  return user.address;
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  getUserAddressById,
  setAddress,
};
