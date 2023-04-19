const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
    first_name: { type: String, required: true, maxLenght: 100 },
    family_name: { type: String, required: true, maxLenght: 100 },
    date_of_birth: Date,
    date_of_death: Date
});

// Virtual for author's full name
authorSchema.virtual("name").get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }
    return fullname;
});
// Virtual for author's URL
authorSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/author/${this._id}`;
});

authorSchema.virtual("date_of_birth_formatted").get(function () {
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

authorSchema.virtual("date_of_death_formatted").get(function () {
    return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
});

authorSchema.virtual("date_of_birth_ISOformat").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toISODate()
    : "";
});

authorSchema.virtual("date_of_death_ISOformat").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toISODate()
    : "";
});

// Export model
module.exports = mongoose.model("Author", authorSchema);