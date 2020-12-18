const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const {Schema} = mongoose;

const productSchema = new Schema({
  categories: [{type: String}],
  weight: {type: Number, default: 100},
  title: {ru: String, ua: String},
  calories: {type: Number},
  groupBloodNotAllowed: {1: Boolean, 2: Boolean, 3: Boolean, 4: Boolean},
});

productSchema.plugin(mongoosePaginate);

async function findByQuery(queryString, params) {
  const options = queryString
    ? {$or: [
        {"title.ru": {"$regex": queryString, "$options": "i"}},
        {"title.ua": {"$regex": queryString, "$options": "i"}}
      ]}
    : {};
  return this.paginate(options, params);
}

productSchema.statics.findByQuery = findByQuery;

module.exports = mongoose.model("Product", productSchema);