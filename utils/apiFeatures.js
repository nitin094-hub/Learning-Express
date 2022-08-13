function ApiFeatures(query, queryString) {
  this.query = query;
  this.queryString = queryString;
  this.filter = function () {
    const queryObj = { ...queryString };
    const exculdeArr = ["sort", "limit", "page", "fields"];
    exculdeArr.forEach((item) => delete queryObj[item]);
    this.query.find(queryObj);
    return this;
  };
  this.sort = function () {
    if (this.queryString.sort) {
      this.query.sort(this.queryString.sort);
    }
    return this;
  };
  this.limit = function () {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query.select(fields);
    } else {
      this.query.select("-__v");
    }
    return this;
  };
  this.pagination = function () {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query.skip(skip).limit(limit);
    return this;
  };
}

module.exports = ApiFeatures;
