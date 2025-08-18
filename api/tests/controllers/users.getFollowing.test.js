const mongoose = require("mongoose");
const User = require("../../models/user");
const { getFollowing } = require("../../controllers/users");

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe("getFollowing", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/gmn_test_following");
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  test("returns populated following for :userId", async () => {
    const a = await User.create({ email:"a@gmn.test", password:"x", username:"a" });
    const b = await User.create({ email:"b@gmn.test", password:"x", username:"b" });
    a.following = [b._id];
    await a.save();

    const req = { params: { userId: a._id.toString() } };
    const res = mockRes();

    await getFollowing(req, res);

    expect(res.json).toHaveBeenCalled();
    const payload = res.json.mock.calls[0][0];
    expect(payload.users).toHaveLength(1);
    expect(payload.users[0]).toMatchObject({
      _id: b._id,
      username: "b",
      email: "b@gmn.test",
    });
  });

  test('supports "me" using req.user_id', async () => {
    const a = await User.create({ email:"a@gmn.test", password:"x", username:"a" });
    const b = await User.create({ email:"b@gmn.test", password:"x", username:"b" });
    a.following = [b._id];
    await a.save();

    const req = { params: { userId: "me" }, user_id: a._id.toString() };
    const res = mockRes();

    await getFollowing(req, res);

    const { users } = res.json.mock.calls[0][0];
    expect(users[0]._id.toString()).toBe(b._id.toString());
  });

  test("404 when user not found", async () => {
    const req = { params: { userId: new mongoose.Types.ObjectId().toString() } };
    const res = mockRes();

    await getFollowing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});