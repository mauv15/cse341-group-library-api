const validator = require("../helpers/validate");

// a feature to check duplicate email in a given collection
const checkDuplicateEmail = async (req, res, collection, userType) => {
  const db = req.app.locals.db;
  const existing = await db
    .collection(collection)
    .findOne({ email: req.body.email });
  if (existing) {
    res.status(409).send({
      success: false,
      message: `Email already in use by another ${userType}`,
    });
    return true; // Duplicate found
  }
  return false; // No duplicate
};

const saveMember = (req, res, next) => {
  const validationRule = {
    firstName: "required|string",
    lastName: "required|string",
    address: "required|string",
    email: "required|string",
    phone: "required|string",
    birthday: "required|string",
    borrowed: "string",
    feeBalance: "required|numeric",
  };

  validator(req.body, validationRule, {}, async (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    }

    try {
      const duplicate = await checkDuplicateEmail(
        req,
        res,
        "members",
        "member"
      );
      if (duplicate) return;
      next();
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Error checking member email",
        error: error.message,
      });
    }
  });
};

const saveUser = (req, res, next) => {
  const validationRule = {
    firstName: "required|string",
    lastName: "required|string",
    email: "required|string",
    phone: "required|string",
    position: "required|string",
    startDate: "required|string",
  };

  validator(req.body, validationRule, {}, async (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    }

    try {
      const duplicate = await checkDuplicateEmail(req, res, "users", "user");
      if (duplicate) return;
      next();
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Error checking user email",
        error: error.message,
      });
    }
  });
};

const saveBook = (req, res, next) => {
  const validationRule = {
    ISBN: "required|string",
    Title: "required|string",
    Author: "required|string",
    publicationYear: "required|integer",
    Genre: "string",
    Pages: "integer",
    userRating: "numeric",
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    }
    next();
  });
};

const saveMovie = (req, res, next) => {
  const validationRule = {
    ISBN: "required|string",
    title: "required|string",
    director: "required|string",
    year: "required|integer",
    genre: "string",
    distributor: "string",
    userRating: "numeric",
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    }
    next();
  });
};

module.exports = {
  saveMember,
  saveUser,
  saveBook,
  saveMovie,
};
