const mongoose = require("mongoose");
//@TODO modificar no nome para medication em tudo ou medicine em tudo.
const Medication = mongoose.model(
  "Medication",
  new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        autopopulate: true
      }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      autopopulate: true
    }
  }, {timestamps: true}).plugin(require('mongoose-autopopulate'))
)
module.exports = Medication;
