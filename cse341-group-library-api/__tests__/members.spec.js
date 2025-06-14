const { getAll, getSingle } = require("../controllers/members");
const { getDb } = require("../db/conn");
const { ObjectId } = require("mongodb");

jest.mock("../db/conn", () => ({
  getDb: jest.fn(),
}));

describe("Members Controller", () => {
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
    test("should return all members", async () => {
      const mockMembers = [{ firstName: "Alice" }, { firstName: "Bob" }];

      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            find: () => ({
              toArray: () => Promise.resolve(mockMembers),
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
      expect(mockRes.json).toHaveBeenCalledWith(mockMembers);
    });
  });

  describe("getSingle", () => {
    test("should return a member with valid ID", async () => {
      const mockMember = { firstName: "Alice" };
      const mockId = new ObjectId();

      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            findOne: () => Promise.resolve(mockMember),
          }),
        }),
      });

      await getSingle({ params: { id: mockId.toString() } }, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/JSON"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMember);
    });

    test("should return 400 for invalid ID", async () => {
      await getSingle({ params: { id: "invalid-id" } }, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});
