const express = require("express");
const request = require("supertest");

jest.mock("../../middleware/tokenChecker", () => (req, _res, next) => {
  req.user_id = "stub-user";
  next();
});

const UsersController = require("../../controllers/users");
jest.spyOn(UsersController, "getFollowing");
jest.spyOn(UsersController, "getUserById");

const usersRouter = require("../../routes/users");

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/users", usersRouter);
  return app;
}

describe("users routes order", () => {
  test("GET /users/:id/following hits getFollowing", async () => {
    UsersController.getFollowing.mockImplementation((req, res) => res.json({ok:true}));
    const app = makeApp();
    await request(app).get("/users/123/following").set("Authorization","Bearer x");
    expect(UsersController.getFollowing).toHaveBeenCalled();
  });

  test("GET /users/:id hits getUserById", async () => {
    UsersController.getUserById.mockImplementation((req, res) => res.json({ok:true}));
    const app = makeApp();
    await request(app).get("/users/123").set("Authorization","Bearer x");
    expect(UsersController.getUserById).toHaveBeenCalled();
  });
});