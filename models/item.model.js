const mongoose = require('mongoose');


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
  createdby:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  labourtime: {
    type: String,
  }

})

module.exports =  mongoose.model('Item', itemSchema)
