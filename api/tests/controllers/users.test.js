const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email and password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "poppy@email.com", password: "1234", username: "Barry Killer" });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({ email: "scarconstt@email.com", password: "1234", username: "Barry Killer" });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "1234" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when username is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "no-username@email.com", password: "1234" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app)
        .post("/users")
        .send({ email: "no-username@email.com", password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });
});

describe("POST /users/:id/follow and DELETE /users/:id/follow", () => {
  let userA, userB, tokenA;

  beforeEach(async () => {
    await User.deleteMany({});

    // Create two users
    userA = new User({
      email: "userA@email.com",
      password: "password",
      username: "UserA"
    });
    await userA.save();

    userB = new User({
      email: "userB@email.com",
      password: "password",
      username: "UserB"
    });
    await userB.save();

    // Log in UserA to get token
    const loginRes = await request(app)
      .post("/tokens")
      .send({ email: userA.email, password: "password" });

    tokenA = loginRes.body.token;
  });

  test("UserA can follow UserB", async () => {
    const res = await request(app)
      .post(`/users/${userB._id}/follow`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);

    // Check DB state
    const updatedA = await User.findById(userA._id);
    const updatedB = await User.findById(userB._id);

    expect(updatedA.following.map(String)).toContain(userB._id.toString());
    expect(updatedB.followers.map(String)).toContain(userA._id.toString());
  });

  test("UserA can unfollow UserB", async () => {
    // First follow
    await request(app)
      .post(`/users/${userB._id}/follow`)
      .set("Authorization", `Bearer ${tokenA}`);

    // Then unfollow
    const res = await request(app)
      .delete(`/users/${userB._id}/follow`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);

    // Check DB state
    const updatedA = await User.findById(userA._id);
    const updatedB = await User.findById(userB._id);

    expect(updatedA.following.map(String)).not.toContain(userB._id.toString());
    expect(updatedB.followers.map(String)).not.toContain(userA._id.toString());
  });

  test("cannot follow a non-existent user", async () => {
    const fakeId = "000000000000000000000000";
    const res = await request(app)
      .post(`/users/${fakeId}/follow`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send();

    expect(res.statusCode).toBe(404);
  });
});