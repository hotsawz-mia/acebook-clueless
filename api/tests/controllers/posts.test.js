// api/tests/controllers/posts.test.js
const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

let token;

describe("/posts", () => {
  beforeEach(async () => {
    // fresh user + token for every test
    const user = new User({
      email: `post-test+${Date.now()}@test.com`,
      password: "12345678",
      username: `post-test-user-${Date.now()}`,
    });
    await user.save();
    token = createToken(user.id);
    await Post.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });

      expect(response.status).toEqual(201);
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World!!");
    });

    test("returns a new token", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world" });

      const newToken = response.body.token;
      expect(newToken).toBeDefined(); // clearer failure if route changes
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      await new Post({ message: "I love all my children equally" }).save();
      await new Post({ message: "I've never cared for GOB" }).save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection", async () => {
      await new Post({ message: "howdy!" }).save();
      await new Post({ message: "hola!" }).save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      expect(posts[0].message).toEqual("howdy!");
      expect(posts[1].message).toEqual("hola!");
    });

    test("returns a new token", async () => {
      await new Post({ message: "First Post!" }).save();
      await new Post({ message: "Second Post!" }).save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      expect(newToken).toBeDefined();
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("the response code is 401", async () => {
      await new Post({ message: "howdy!" }).save();
      await new Post({ message: "hola!" }).save();

      const response = await request(app).get("/posts");
      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      await new Post({ message: "howdy!" }).save();
      await new Post({ message: "hola!" }).save();

      const response = await request(app).get("/posts");
      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      await new Post({ message: "howdy!" }).save();
      await new Post({ message: "hola!" }).save();

      const response = await request(app).get("/posts");
      expect(response.body.token).toEqual(undefined);
    });
  });
});