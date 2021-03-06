const request = require("supertest");
const { Genre } = require("../../models/genre_model");
const { User } = require("../../models/user_model");
const mongoose = require("mongoose");

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../app");
  });
  afterEach(async () => {
    await server.close();
    await Genre.collection.remove({});
  });
  describe("GET /", () => {
    it("should return all genres with status 200", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
        { name: "genre3" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some((genre) => genre.name === "genre1")).toBeTruthy();
      expect(res.body.some((genre) => genre.name === "genre2")).toBeTruthy();
      expect(res.body.some((genre) => genre.name === "genre3")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return genre with given id", async () => {
      let genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 status if invalid id passed", async () => {
      const res = await request(server).get("/api/genres/1235");
      expect(res.status).toBe(404);
    });

    it("should return 404 if genre not found with given id", async () => {
      const id = mongoose.Types.ObjectId().toHexString();

      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres/")
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 character", async () => {
      const token = new User().genrateAuthToken();

      const res = await request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      const token = new User().genrateAuthToken();

      const name = new Array(52).join("a");
      const res = await request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });

    it("should save a genre if its valid", async () => {
      const token = new User().genrateAuthToken();

      const res = await request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ name: "genre1" });

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return genre in response", async () => {
      const token = new User().genrateAuthToken();

      const res = await request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ name: "genreTest" });

      expect(res.body).toHaveProperty("name", "genreTest");
    });
  });

  describe("PUT /:id", () => {
    it("should 401 if user is not logged in", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const genre = new Genre({ _id: id, name: "genre1" });
      const res = await request(server)
        .put("/api/genres/" + genre._id)
        .send({ name: "genre2" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less then 5 character", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const genre = new Genre({ _id: id, name: "genre" });
      const token = new User().genrateAuthToken();

      const res = await request(server)
        .put("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name: "123" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more then 50 character", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const genre = new Genre({ _id: id, name: "genre" });
      const token = new User().genrateAuthToken();

      const name = new Array(52).join("a");

      const res = await request(server)
        .put("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });

    it("should return 404 if genre not found with given id", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const token = new User().genrateAuthToken();

      const res = await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name: "123456" });

      expect(res.status).toBe(404);
    });

    it("should return updated genre with status 200", async () => {
      const token = new User().genrateAuthToken();
      const genre = new Genre({ name: "genreTest" });
      await genre.save();
      const id = genre._id;

      const res = await request(server)
        .put("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name: "123456" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "123456");
    });
  });

  describe("DELETE /:id", () => {
    it("should return 401 if user is not logged in", async () => {
      const genre = new Genre({ name: "genre12" });
      await genre.save();
      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", "")
        .send();
      expect(res.status).toBe(401);
    });

    it("should return 403 if user is not admin", async () => {
      const token = new User({ email: "a", isAdmin: false }).genrateAuthToken();
      const genre = new Genre({ name: "genre123" });
      await genre.save();

      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send();
      expect(res.status).toBe(403);
    });

    it("should return 404 if provided id is invalid", async () => {
      const token = new User({ email: "a", isAdmin: true }).genrateAuthToken();

      const res = await request(server)
        .delete("/api/genres/123")
        .set("x-auth-token", token)
        .send();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre found with provided id", async () => {
      const token = new User({ email: "a", isAdmin: true }).genrateAuthToken();
      const id = mongoose.Types.ObjectId().toHexString();

      const res = await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();

      expect(res.status).toBe(404);
    });

    it("should remove genre if inputs are valid", async () => {
      const token = new User({ email: "a", isAdmin: true }).genrateAuthToken();
      const genre = new Genre({ name: "genre123" });
      await genre.save();

      await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send();

      const genreInDb = await Genre.findById(genre._id);

      expect(genreInDb).toBeNull();
    });

    it("should return the deleted genre in response", async () => {
      const token = new User({ email: "a", isAdmin: true }).genrateAuthToken();
      const genre = new Genre({ name: "genre123" });
      await genre.save();

      const res = await request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send();

      expect(res.body).toHaveProperty("name", genre.name);
      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
    });
  });
});
