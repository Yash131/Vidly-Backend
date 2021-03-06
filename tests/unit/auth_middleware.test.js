const { User } = require("../../models/user_model");
const auth = require("../../middlewares/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with payload of valid JWT", () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      email: "a",
      isAdmin: true,
    };
    const token = new User(user).genrateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
