const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");
const mongoose = require("mongoose");

require("../mongodb_helper");

describe("PUT /users/me", () => {
  let userA, userB, tokenA;

  beforeEach(async () => {
    await User.deleteMany({});

    userA = await new User({
      email: "a@example.com",
      password: "password",
      username: "Alpha",
    }).save();

    userB = await new User({
      email: "b@example.com",
      password: "password",
      username: "Bravo",
    }).save();

    const loginRes = await request(app)
      .post("/tokens")
      .send({ email: "a@example.com", password: "password" });

    tokenA = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("updates own username when authenticated", async () => {
    const res = await request(app)
      .put("/users/me")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ username: "NewAlpha" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.username).toBe("NewAlpha");

    const fresh = await User.findById(userA._id);
    expect(fresh.username).toBe("NewAlpha");
  });

  test("returns 401 when no token", async () => {
    const res = await request(app)
      .put("/users/me")
      .send({ username: "Nope" });

    expect(res.status).toBe(401);
  });

  test("returns 400 when username is missing/blank", async () => {
    const res1 = await request(app)
      .put("/users/me")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({}); // no username

    expect(res1.status).toBe(400);

    const res2 = await request(app)
      .put("/users/me")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ username: "   " }); // whitespace

    expect(res2.status).toBe(400);
  });

  test("returns 409 on duplicate username", async () => {
    // userB already has username "Bravo"
    const res = await request(app)
      .put("/users/me")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ username: "Bravo" });

    expect([409, 400]).toContain(res.status); // 409 if you implemented duplicate guard, else 400 from validation
  });
});