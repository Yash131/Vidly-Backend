const router = require("express").Router();
const { User } = require("../models/user_model");
const { Order } = require("../models/order_model");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

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

  let cancelledOrder = await Order.find({
    "userDetails._id": userID,
    orderStatus: "Cancelled",
  });
  let totalOrder = await Order.find({ "userDetails._id": userID });

  let data = {
    totalOrders: totalOrder.length,
    cancelledOrders: cancelledOrder.length,
  };

  if (!totalOrder.length) {
    return res.status(201).send({ message: "No orders found!", data: data });
  }

  return res.send({
    status: "Success",
    data: data,
  });
});

router.get("/all_orders", [auth, admin], async (req, res) => {

  let allorders = await Order.find()
  let liveorders = await Order.find({ orderStatus: "Placed" }).sort("-createdAt");
  let cancelledOrders = await Order.find({ orderStatus: "Cancelled" }).sort("-createdAt");
  let shippedOrders = await Order.find({ orderStatus: "Shipped" }).sort("-createdAt");
  let completedOrders = await Order.find({ orderStatus: "Completed" }).sort("-createdAt");

  if (!liveorders.length || !allorders.length ) {
    return res.status(404).send({ message: "No Order's Found!" });
  }
  res.send({
    all_orders : allorders,
    total_cancelled_orders: cancelledOrders.length,
    total_live_orders: liveorders.length,
    total_shipped_orders: shippedOrders.length,
    total_completed_orders: completedOrders.length,
    all_live_orders: liveorders,
    all_cancelled_orders: cancelledOrders,
    all_shipped_orders : shippedOrders,
    all_completed_orders : completedOrders,
    status: "success",
  });
});

router.post("/cancel_order_by_id", [auth, admin], async (req, res) => {
  const orderID = req.body.orderID;

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

router.post("/changeOrderStatus", [auth, admin], async (req, res) => {
  const {orderID, orderStatus }= req.body;
  

  let updateOrder = await Order.findOneAndUpdate(
    { _id: orderID },
    { orderStatus: orderStatus },
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
    message: "Order status Changed Successfully",
    data: updateOrder,
  });

});

module.exports = router;
