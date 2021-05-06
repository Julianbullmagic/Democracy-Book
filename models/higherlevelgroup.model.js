const mongoose = require('mongoose');




const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  lastcandidateshuffle:Number,
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  centroid:[Number],
  leaders:[{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  members:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  lowerGroupIds:[{type:mongoose.Schema.Types.ObjectId,ref:"LocalGroup"}],
  allmembers: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  expertcandidates: [{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],

})

module.exports =  mongoose.model('HigherLevelGroup', groupSchema)
