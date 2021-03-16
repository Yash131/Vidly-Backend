const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const router = require("express").Router();

const { ContactUs } = require("../models/contactUs_model");
const { Order } = require("../models/order_model");
const { User } = require("../models/user_model");
const { UpcominMovie } = require("../models/upcomingMovies_modal");
const { Genre } = require("../models/genre_model");
const { Movie } = require("../models/movie_model");

router.get("/basic_infos", [auth, admin], async (req, res) => {
  const orders = await Order.find();
  const messages = await ContactUs.find();
  const users = await User.find().select("-password");
  const movies = await Movie.find().select(["title", "numberInStock"]);

  Order.aggregate([
    {
      $match: {
        orderStatus: "Completed",
      },
    },
    {
      $group: {
        _id: null,
        TotalIncome: { $sum: "$totalPrice" },
        totalCompletedOrders: { $sum: 1 },
        totalCompletedOrders: { $sum: 1 },
        costOnDelivery: { $sum: 1 },
      },
    },
  ])
    .then((data) => {
      //   console.log(data);

      let obj = {
        totalRevenue: data[0].TotalIncome,
        totalExpense:
          data[0].totalCompletedOrders +
          data[0].costOnDelivery +
          data[0].TotalIncome * 0.4,
        totalOrders: orders.length,
        totalMessages: messages.length,
        totalUsers: users.length,
        movieQntyData: movies,
      };

      return res.send(obj);
    })
    .catch((e) => {
      return res.send(e);
    });
});

router.get("/orderChart_data", [auth, admin], async (req, res) => {
  // const startDate = "2021-03-10";
  // const endDate = Date.now();
  await Order.aggregate([
    { $match: {} },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.send(e);
    });
});

module.exports = router;
