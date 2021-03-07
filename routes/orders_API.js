const router = require("express").Router();
const { User } = require("../models/user_model");
const { Order } = require("../models/order_model");
const auth = require("../middlewares/auth");

router.post("/", auth, async (req, res) => {
  let {
    shippingDetails,
    products,
    userDetails,
    paymentModeData,
    totalPrice,
    paymentMode,
    paymentStaus,
    orderStatus,
  } = req.body;

  let order = new Order({
    shippingDetails: shippingDetails,
    products: products,
    userDetails: userDetails,
    paymentModeData: paymentModeData,
    totalPrice: totalPrice,
    paymentMode: paymentMode,
    paymentStaus: paymentStaus,
    orderStatus: orderStatus,
  });
  order = await order.save();
  res.send(order);
});

router.get("/my-orders", auth, async (req, res) => {
  const userID = req.user._id;
  console.log(userID);
  let user = await User.findById(userID);
  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  let order = await Order.find({ "userDetails._id": userID });
  if (!order.length) {
    return res.status(200).send({ message: "No orders found!", data: order });
  }

  res.send({ message: "Here is your orders!", data: order });
});

router.post("/cancel-order", auth, async (req, res) => {
  const { orderID } = req.body;
  const userID = req.user._id;

  let user = await User.findById(userID);
  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  let updateOrder = await Order.findOneAndUpdate(
    { _id: orderID },
    { orderStatus: "Cancelled" },
    {
      new: true,
    }
  );

  if (!updateOrder) {
    return res.status(404).send({ message: "Order not found" });
  }
  updateOrder = await updateOrder.save();

  console.log(updateOrder.orderStatus);

  return res.send({
    message: "Order Cancelled Successfully",
    data: updateOrder,
  });
});

router.get("/order_counter", auth, async (req, res) => {
  const userID = req.user._id;
  console.log(userID);
  let user = await User.findById(userID);
  if (!user) {
    return res.status(400).send("Invalid user ID.");
  }

  let cancelledOrder = await Order.find({ "userDetails._id": userID,  "orderStatus": "Cancelled"})
  let totalOrder = await Order.find({ "userDetails._id": userID})
  if (!totalOrder.length) {
    return res.status(200).send({ message: "No orders found!", data: order });
  }

  res.send({ status: "Success", totalOrders : totalOrder.length, cancelledOrders : cancelledOrder.length});
});

module.exports = router;
