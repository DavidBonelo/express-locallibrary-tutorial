const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = (req, res) => {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec(function (err, genre_list) {
      res.render("genre_list", {
        title: "Genre List",
        genre_list: genre_list,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(cb) {
        return Genre.findById(req.params.id, cb);
      },
      book_list(cb) {
        return Book.find({ genre: req.params.id }).exec(cb);
      },
    },
    function (err, results) {
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
        title: `${results.genre.name} books list:`,
        genre: results.genre,
        book_list: results.book_list,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.id }, "title summary").exec(callback);
      },
    },
    (err, result, next) => {
      if (err) {
        next(err);
      }
      if (result.genre == null) {
        res.redirect("/catalog/genres");
      }
      res.render("genre_delete", {
        title: "Detete genre",
        genre: result.genre,
        genre_books: result.genre_books,
      });
    }
  );
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.body.genreid).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.body.genreid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) next(err);
      if (results.genre_books > 0) {
        // there exists books with this genre, redirect to genre detail
        res.render("genre_delete", {
          title: "Delete genre",
          genre: results.genre,
          genre_books: results.genre_books,
        });
      }
      results.genre.remove((err) => {
        if (err) next(err);
      });
      res.redirect("/catalog/genres");
    }
  );
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res, next) => {
  Genre.findById(req.params.id).exec(function (err, genre) {
    if (err) {
      return next(err);
    }
    if (genre == null) {
      // No results.
      const err = new Error("Genre not found");
      err.status = 404;
      return next(err);
    }

    res.render("genre_form", {
      title: 'Update Genre',
      genre: genre,
    });
  });
};

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req).array();

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    // Check if Genre with same name already exists.
    Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
      if (err) {
        return next(err);
      }
      if (found_genre) {
        // Genre exists, add error
        errors.push("A genre with the same name already exists");
      }
    });

    if (errors.length!=0) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Update Genre",
        genre,
        errors: errors,
      });
      return;
    }
    // Data from form is valid. Update the record.
    Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {
      if (err) {
        return next(err);
      }
      // Successful: Redirect to genre detail page.
      res.redirect(thegenre.url);
    });
  },
];
