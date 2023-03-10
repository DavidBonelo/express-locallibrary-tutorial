const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");

// Display list of all Genre.
exports.genre_list = (req, res) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec(function (err, genre_list) {
      res.render("genre_list", {
        title: "Genre List",
        genre_list: genre_list
      })
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {


  async.parallel({
    genre (cb) {
      return Genre.findById(req.params.id, cb);
    },
    book_list(cb) {
      return Book.find({ genre: req.params.id }).exec(cb);
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.genre == null) {
      // No results.
      const err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }

    res.render("genre_detail", {
      title: `${results.genre.name} movies list:`,
      book_list: results.book_list
    });
  });
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre create GET");
};

// Handle Genre create on POST.
exports.genre_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre create POST");
};

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
