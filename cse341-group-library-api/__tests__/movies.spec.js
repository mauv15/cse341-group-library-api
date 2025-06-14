const { getAllMovies, getSingleMovie } = require("../controllers/movies");
const { getDb } = require("../db/conn");
const { ObjectId } = require("mongodb");

jest.mock("../db/conn", () => ({
  getDb: jest.fn(),
}));

describe("Movies Controller", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  describe("getAllMovies", () => {
    test("should return all movies", async () => {
      const mockMovies = [{ title: "Movie 1" }, { title: "Movie 2" }];
      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            find: () => ({
              toArray: () => mockMovies,
            }),
          }),
        }),
      });

      await getAllMovies({}, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/JSON"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMovies);
    });
  });

  describe("getSingleMovie", () => {
    test("should return movie with valid ID", async () => {
      const mockMovie = { title: "Test Movie" };
      const req = { params: { id: new ObjectId().toString() } };

      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            findOne: () => mockMovie,
          }),
        }),
      });

      await getSingleMovie(req, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMovie);
    });

    test("should return 400 for invalid ID", async () => {
      const req = { params: { id: "123" } };
      await getSingleMovie(req, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
