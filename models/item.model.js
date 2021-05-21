const mongoose = require('mongoose');
var random = require('mongoose-simple-random');


const itemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,

  },
  description: {
    type: String,
  },
  priceorrate: {
    type: String,
  },
  cooperative:{type:mongoose.Schema.Types.ObjectId,ref:"Shop"},
  createdby:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  labourtime: {
    type: String,
  }

})

itemSchema.plugin(random);


module.exports =  mongoose.model('Item', itemSchema)
