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

  describe("GET /users/:userId/posts", () => {
    test("returns 200 and only posts by :userId", async () => {
      // 1. Create userA and userB
      const userA = await new User({
        email: `a+${Date.now()}@t.com`,
        password: "12345678",
        username: `a-${Date.now()}`
      }).save();
    
      const userB = await new User({
        email: `b+${Date.now()}@t.com`,
        password: "12345678",
        username: `b-${Date.now()}`
      }).save();
    
      // 2. Create posts for both users
      await new Post({ message: "A1", user: userA._id }).save();
      await new Post({ message: "A2", user: userA._id }).save();
      await new Post({ message: "B1", user: userB._id }).save();
    
      // 3. Call GET /users/:userA_id/posts with token
      const res = await request(app)
        .get(`/users/${userA._id}/posts`)
        .set("Authorization", `Bearer ${token}`);

      // 4. Expect response.status to be 200
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.posts)).toBe(true);

      // 5. Expect response.body.posts length === 2
      expect(res.body.posts).toHaveLength(2);
    
          // handle either ObjectId or populated object
      const returnedUserIds = res.body.posts.map(p => String(p.user?._id ?? p.user));
      expect(returnedUserIds.every(id => id === String(userA._id))).toBe(true);
    
      const messages = res.body.posts.map(p => p.message);

      // 6. Expect all returned posts to belong to userA
      expect(messages).toEqual(expect.arrayContaining(["A1", "A2"]));

      // 7. Expect no posts from userB
      expect(messages).not.toEqual(expect.arrayContaining(["B1"]));
    });

    test("sorts newest first", async () => {
      // 1. Create userA and userB
      const userA = await new User({
        email: `a+${Date.now()}@t.com`,
        password: "12345678",
        username: `a-${Date.now()}`
      }).save();

      // 2. Create posts for this users
      await new Post({ message: "A3", user: userA._id, createdAt: new Date("2022-01-01") }).save();
      await new Post({ message: "A2", user: userA._id, createdAt: new Date("2021-01-01") }).save();
      await new Post({ message: "A1", user: userA._id, createdAt: new Date("2020-01-01") }).save();
      await new Post({ message: "A4", user: userA._id, createdAt: new Date("2023-01-01") }).save();

      // 3. Call GET /users/:userA_id/posts with token
      const res = await request(app)
        .get(`/users/${userA._id}/posts`)
        .set("Authorization", `Bearer ${token}`);

      // 4. Expect response.status to be 200
      expect(res.status).toBe(200);
      const messages = res.body.posts.map(p => p.message);

      // 5. Expect all returned posts to belong to userA
      expect(messages).toEqual(["A4", "A3", "A2", "A1"]);

      
    });

    test("includes populated author fields needed by frontend (username, _id)", async () => {

      // 1. Create userA 
      const userA = await new User({
        email: `a+${Date.now()}@t.com`,
        password: "12345678",
        username: `Captain Testy`
      }).save();
      
      // 2. Create posts for this users
      await new Post({ message: "My post", user: userA._id, createdAt: new Date("2022-01-01") }).save();

      // 3. Call GET /users/:userA_id/posts with token
      const res = await request(app)
      .get(`/users/${userA._id}/posts`)
      .set("Authorization", `Bearer ${token}`);

      // 4. Expect response.status to be 200
      expect(res.status).toBe(200);
      const author = res.body.posts[0].user;

      // 5. Expect returned post to belong to userA and include their username
      expect(author).toBeDefined();
      expect(author.username).toBe("Captain Testy");
      expect(String(author._id)).toBe(String(userA._id)); 

    });

    test("returns empty array when user has no posts", async () => {
      // 1. Create userA
      const userA = await new User({
        email: `a+${Date.now()}@t.com`,
        password: "12345678",
        username: `User Name`
      }).save();

      // 2. Call GET /users/:userA_id/posts with token
      const res = await request(app)
      .get(`/users/${userA._id}/posts`)
      .set("Authorization", `Bearer ${token}`);

      // 3. Expect response.status to be 200
      expect(res.status).toBe(200);

      // 4. Expect all returned posts to belong to userA
      expect(res.body.posts).toHaveLength(0);            
    });

    test("401 without token", async () => {
      // 1. Create userA
      const userA = await new User({
        email: `a+${Date.now()}@t.com`,
        password: "12345678",
        username: `User Name`
      }).save();

      // 2. Call GET /users/:userA_id/posts with token
      const res = await request(app)
      .get(`/users/${userA._id}/posts`);

      // 3. Expect response.status to be 401
      expect(res.status).toBe(401);
    });

  });
});