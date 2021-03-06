const { User } = require("../../models/user_model");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.genrateAuthToken", () => {
  it("should generate a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: "abc",
      isAdmin: true,
    };
    const user = new User(payload);

    const token = user.genrateAuthToken();

    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

    expect(decoded).toMatchObject(payload);
  });
});
