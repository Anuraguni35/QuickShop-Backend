const express = require("express");
const userRoute = require('./user.route');
const authRoute = require("./auth.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const router = express.Router();

// Reroute all API requests beginning with the `/v1/users` route to Express router in user.route.js
router.get('/',(req,res)=>{
return res.json({status:true,msg:"Welcome to QuickShop Server!"})
})




router.use("/auth" ,authRoute);
router.use('/users',userRoute);

router.use("/products", productRoute);
router.use("/cart", cartRoute);

module.exports = router;
