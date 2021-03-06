const request = require("supertest");
const { User } = require("../../models/user_model");
const { Genre } = require("../../models/genre_model");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async() => {
    await Genre.remove({})
    await server.close();
  });

  var token;
  var name = "genre1";

  let excu = async () => {
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: name });
  };

  beforeEach(() => {
    token = new User().genrateAuthToken();
  });

  it("should return 401 if token not provided", async () => {
    token = "";
    const res = await excu();

    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid token provided", async () => {
    token = "12354689";
    const res = await excu();

    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async() => {
      const res = await excu();
      expect(res.status).toBe(200)
  });
});
