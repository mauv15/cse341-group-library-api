const { getAll, getSingle } = require("../controllers/users");
const { getDb } = require("../db/conn");
const { ObjectId } = require("mongodb");

jest.mock("../db/conn", () => ({
  getDb: jest.fn(),
}));

describe("Users Controller", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  describe("getAll", () => {
    test("should return all users", async () => {
      const mockUsers = [{ name: "Alice" }, { name: "Bob" }];
      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            find: () => ({
              toArray: () => Promise.resolve(mockUsers),
            }),
          }),
        }),
      });

      await getAll({}, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/JSON"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });
  });

  describe("getSingle", () => {
    test("should return a single user for valid ID", async () => {
      const req = { params: { id: new ObjectId().toString() } };
      const mockUser = { name: "Charlie" };

      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            findOne: () => Promise.resolve(mockUser),
          }),
        }),
      });

      await getSingle(req, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/JSON"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
    });

    test("should return 400 for invalid ID", async () => {
      const req = { params: { id: "123" } };
      await getSingle(req, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        "Must use a valid user id to find a user"
      );
    });
  });
});
