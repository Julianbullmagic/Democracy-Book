const mongoose = require('mongoose');
const User = require("../models/user.model");
const Suggestion = require("../models/suggestion.model");


const ruleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  rule: {
    type: String,
    required: true
  },
  disagree: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  suggestions: [{type:mongoose.Schema.Types.ObjectId,ref:"Suggestion"}],

})

module.exports =  mongoose.model('Rule', ruleSchema)
