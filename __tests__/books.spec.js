// some comments on what I saw from some articles I read. The other test files don't have these comments:

// 1. import functions that we want to use and test from controllers

const {
  getAllBooks,
  getSingleBook,
  
} = require("../controllers/books");
const { getDb } = require("../db/conn");
const { ObjectId } = require("mongodb")

//2. mocking the database connection so we don't connect to a real one when testing
jest.mock("../db/conn", () => ({
  getDb: jest.fn(),
}));

//3. all tests for book controller are grouped under the describe block
describe("Books Controller", () => {
  //we have to simulate the response object that will be passed to the controller functions
  let mockRes;

  //it runs before each test to clean up the mock res object
  beforeEach(() => {
    /*an article I read in stack overflow spoke of mokcing node http requests...mocking the response object that will be passed to the controller functions
    
    creates a fake res object with the key Express methods:

    status (to set HTTP status code)

    json (to send JSON data)

    send (to send plain responses)

    setHeader (to set response headers)
    
    each of these is a Jest mock function written as (jest.fn())*/

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  //4. then we write a test for getting all books
  describe("getAllBooks", () => {
    test("should return all books", async () => {
      //mock data that we will use to test output or to check whether what we expect follows this format, an array
      const mockBooks = [{ Title: "Book 1" }, { Title: "Book 2" }];

      //mocking the getDb function to return a mock database connection
      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            find: () => ({
              toArray: () => Promise.resolve(mockBooks), //Promise.resolve(mockBooks) means the function returns a promise that instantly resolves with mockBooks, which is a fake list of books we defined for the test.
              //So in the test, when our code calls find().toArray(), it acts like it hit the real database and returned those two book objects but really, it's just returning our fake data.
            }),
          }),
        }),
      });

      await getAllBooks({}, mockRes);

      //expectations to check if the response object was called with the right methods and data
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/JSON"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBooks);
    });

    // Test for error handling
    test("should return 400 on error", async () => {
      getDb.mockImplementation(() => {
        throw new Error("Database error");
      });

      await getAllBooks({}, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });

  describe("getSingleBook", () => {
    test("should return a book with valid ID", async () => {
      const bookId = new ObjectId();
      const mockBook = { _id: bookId, Title: "Book X" };

      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            findOne: () => Promise.resolve(mockBook),
          }),
        }),
      });

      const mockReq = { params: { id: bookId.toString() } };

      await getSingleBook(mockReq, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/JSON"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockBook);
    });

    test("should return 400 for invalid ID", async () => {
      const mockReq = { params: { id: "invalid" } };

      await getSingleBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        "Must use a valid id to find a book"
      );
    });

    test("should return 404 if book not found", async () => {
      const bookId = new ObjectId();

      getDb.mockReturnValue({
        db: () => ({
          collection: () => ({
            findOne: () => Promise.resolve(null),
          }),
        }),
      });

      const mockReq = { params: { id: bookId.toString() } };

      await getSingleBook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Book not found" });
    });
  });
});
